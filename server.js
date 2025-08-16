// server.js (ESM)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'node:util';

// ---- helpers за __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- DB helpers с sqlite3 (promisify)
const DB_PATH = path.join(__dirname, 'data.db');
sqlite3.verbose();

let db; // ще се инициализира в initDB()

function wrapDb(database) {
  return {
    run(sql, ...params) {
      return new Promise((resolve, reject) => {
        database.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    get(sql, ...params) {
      return new Promise((resolve, reject) => {
        database.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
      });
    },
    all(sql, ...params) {
      return new Promise((resolve, reject) => {
        database.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
      });
    }
  };
}

async function initDB() {
  // отваряме/създаваме файла
  const raw = new sqlite3.Database(DB_PATH);
  db = wrapDb(raw);

  // зареждаме schema.sql ако има; иначе fallback
  const schemaFile = path.join(__dirname, 'schema.sql');
  let schemaSql;
  try {
    schemaSql = await fs.readFile(schemaFile, 'utf8');
  } catch {
    schemaSql = `
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date  TEXT NOT NULL,
        summary TEXT,
        link TEXT
      );
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start TEXT NOT NULL,
        location TEXT
      );
    `;
  }

  // изпълняваме schema-та
  await new Promise((resolve, reject) => {
    raw.exec(schemaSql, err => (err ? reject(err) : resolve()));
  });
}

// ---- admin guard (за POST/DELETE)
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
function requireAdmin(req, res, next) {
  const headerSecret = req.header('x-admin-secret');
  const bodySecret = req.body?.secret;
  const ok = (headerSecret && headerSecret === ADMIN_SECRET) ||
             (bodySecret  && bodySecret  === ADMIN_SECRET);
  if (!ok) return res.status(401).json({ error: 'unauthorized' });
  next();
}

// ---- health
app.get('/api/health', (_, res) => {
  res.json({ ok: true, env: 'production', time: new Date().toISOString() });
});

// ---- NEWS
app.get('/api/news', async (_req, res) => {
  try {
    const rows = await db.all('SELECT * FROM news ORDER BY date DESC, id DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_fetch_news' });
  }
});

app.post('/api/news', requireAdmin, async (req, res) => {
  try {
    const { title, date, summary = '', link = '' } = req.body || {};
    if (!title || !date) return res.status(400).json({ error: 'title_and_date_required' });
    const result = await db.run(
      'INSERT INTO news (title, date, summary, link) VALUES (?,?,?,?)',
      title, date, summary, link
    );
    const row = await db.get('SELECT * FROM news WHERE id=?', result.lastID);
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_create_news' });
  }
});

app.delete('/api/news/:id', requireAdmin, async (req, res) => {
  try {
    const { changes } = await db.run('DELETE FROM news WHERE id=?', req.params.id);
    if (!changes) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_delete_news' });
  }
});

// ---- EVENTS
app.get('/api/events', async (_req, res) => {
  try {
    const rows = await db.all('SELECT * FROM events ORDER BY start ASC, id ASC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_fetch_events' });
  }
});

app.post('/api/events', requireAdmin, async (req, res) => {
  try {
    const { title, start, location = '' } = req.body || {};
    if (!title || !start) return res.status(400).json({ error: 'title_and_start_required' });
    const result = await db.run(
      'INSERT INTO events (title, start, location) VALUES (?,?,?)',
      title, start, location
    );
    const row = await db.get('SELECT * FROM events WHERE id=?', result.lastID);
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_create_event' });
  }
});

app.delete('/api/events/:id', requireAdmin, async (req, res) => {
  try {
    const { changes } = await db.run('DELETE FROM events WHERE id=?', req.params.id);
    if (!changes) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_delete_event' });
  }
});

// ---- START
const PORT = process.env.PORT || 5000;
initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB init failed:', err);
    process.exit(1);
  });
