import express from "express";
import cors from "cors";
import health from "./api/health.js";
import ping from "./api/ping.js";

const app = express();
app.use(express.json());

// CORS – позволени домейни (добави и твоя точен Vercel домейн при нужда)
const allowList = new Set([
  "http://localhost:5173",
  "https://www.leadertv.org",
  "https://leadertv.org",
]);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // Postman/PowerShell
      try {
        if (allowList.has(origin)) return cb(null, true);
        const host = new URL(origin).host;
        if (/\.vercel\.app$/i.test(host)) return cb(null, true);
      } catch {}
      return cb(null, false);
    },
  })
);

// Логер за API (по желание – помага за дебъг)
app.use("/api", (req, _res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Временен in-memory store (по-късно ще е БД)
const store = { news: [], events: [] };

// Мини-рутъри
app.use("/api", health);
app.use("/api", ping);

// -------- NEWS --------
app.get("/api/news", (req, res) => res.json(store.news));

app.post("/api/news", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title ?? "",
    date: req.body?.date ?? "",
    body: req.body?.body ?? "",
  };
  store.news.unshift(item);
  res.status(201).json(item);
});

app.put("/api/news/:id", (req, res) => {
  const i = store.news.findIndex(n => (n.id || n._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  store.news[i] = { ...store.news[i], ...req.body };
  res.json(store.news[i]);
});

app.delete("/api/news/:id", (req, res) => {
  const before = store.news.length;
  store.news = store.news.filter(n => (n.id || n._id) !== req.params.id);
  res.sendStatus(before === store.news.length ? 404 : 204);
});

// -------- EVENTS --------
app.get("/api/events", (req, res) => res.json(store.events));

app.post("/api/events", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title ?? "",
    date: req.body?.date ?? "",
    location: req.body?.location ?? "",
  };
  store.events.unshift(item);
  res.status(201).json(item);
});

app.put("/api/events/:id", (req, res) => {
  const i = store.events.findIndex(e => (e.id || e._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  store.events[i] = { ...store.events[i], ...req.body };
  res.json(store.events[i]);
});

app.delete("/api/events/:id", (req, res) => {
  const before = store.events.length;
  store.events = store.events.filter(e => (e.id || e._id) !== req.params.id);
  res.sendStatus(before === store.events.length ? 404 : 204);
});

// 404 за /api
app.use("/api", (req, res) => res.status(404).json({ error: "Not found", path: req.path }));

// глобален error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// корен
app.get("/", (_req, res) => res.send("LeaderTV backend OK"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("API on :" + port));
