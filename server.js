import express from "express";
import cors from "cors";
import health from "./api/health.js";
import ping from "./api/ping.js";

const app = express();

// ---- middleware ----
app.use(express.json());

// CORS: localhost, leadertv.org, и всички *.vercel.app (за Preview/Prod)
const allowedHosts = new Set([
  "http://localhost:5173",
  "https://www.leadertv.org",
  "https://leadertv.org",
]);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow curl/Postman
      if (allowedHosts.has(origin)) return cb(null, true);
      if (/\.vercel\.app$/.test(new URL(origin).host)) return cb(null, true);
      return cb(null, false);
    },
  })
);

// диагностика (временно – помага да видим хитовете към API)
app.use("/api", (req, _res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// ---- IN-MEMORY STORE (временно; после се заменя с база) ----
const store = { news: [], events: [] };

// helper: гарантира JSON отговор
const sendJson = (res, data, code = 200) =>
  res.status(code).type("application/json").send(JSON.stringify(data));

// ---- HEALTH & PING (чрез мини-рутърите) ----
app.use("/api", health);
app.use("/api", ping);

// ---- NEWS ----
// GET /api/news  -> []
app.get("/api/news", (req, res) => {
  sendJson(res, store.news);
});

// POST /api/news
app.post("/api/news", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title || "",
    date: req.body?.date || "",
    body: req.body?.body || "",
  };
  store.news.unshift(item);
  sendJson(res, item, 201);
});

// PUT /api/news/:id
app.put("/api/news/:id", (req, res) => {
  const i = store.news.findIndex((n) => (n.id || n._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  store.news[i] = { ...store.news[i], ...req.body };
  sendJson(res, store.news[i]);
});

// DELETE /api/news/:id
app.delete("/api/news/:id", (req, res) => {
  const before = store.news.length;
  store.news = store.news.filter((n) => (n.id || n._id) !== req.params.id);
  return res.sendStatus(before === store.news.length ? 404 : 204);
});

// ---- EVENTS ----
app.get("/api/events", (req, res) => {
  sendJson(res, store.events);
});

app.post("/api/events", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title || "",
    date: req.body?.date || "",
    location: req.body?.location || "",
  };
  store.events.unshift(item);
  sendJson(res, item, 201);
});

app.put("/api/events/:id", (req, res) => {
  const i = store.events.findIndex((e) => (e.id || e._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  store.events[i] = { ...store.events[i], ...req.body };
  sendJson(res, store.events[i]);
});

app.delete("/api/events/:id", (req, res) => {
  const before = store.events.length;
  store.events = store.events.filter((e) => (e.id || e._id) !== req.params.id);
  return res.sendStatus(before === store.events.length ? 404 : 204);
});

// ---- 404 за /api (JSON) ----
app.use("/api", (req, res) =>
  res.status(404).json({ error: "Not found", path: req.path })
);

// ---- Глобален error handler ----
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// корен
app.get("/", (_req, res) => res.send("LeaderTV backend OK"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("API on :" + port));
