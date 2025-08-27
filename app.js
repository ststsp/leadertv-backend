import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// demo endpoints (чете от статични JSON-и)
import news from './data/news.json' assert { type: 'json' };
import events from './data/events.json' assert { type: 'json' };

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/news',   (req, res) => res.json(news));
app.get('/api/events', (req, res) => res.json(events));

export default app;
