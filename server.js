import express from "express";
import cors from "cors";
import health from "./api/health.js";
import ping from "./api/ping.js";

const app = express();
app.use(express.json());

// Позволени произходи (добави точния ти Vercel домейн ако ползваш такъв)
const allowed = new Set([
  "http://localhost:5173",
  "https://www.leadertv.org",
  "https://leadertv.org",
]);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);                 // Postman/curl
    try {
      if (allowed.has(origin)) return cb(null, true);
      const host = new URL(origin).host || "";
      if (/\.vercel\.app$/.test(host)) return cb(null, true);
    } catch {}
    return cb(null, false);
  }
}));

// Диагностика (можеш да го махнеш когато всичко тръгне)
app.use("/api", (req, _res, next) => { console.log(`[API] ${req.method} ${req.url}`); next(); });

// --- Временни in-memory данни ---
const store = { news: [], events: [] };

// HEALTH & PING (мини рутъри)
app.use("/api", health);
app.use("/api", ping);

// --------- NEWS ----------
app.get("/api/news", (req, res) => {
  res.status(200).type("application/json").send(JSON.stringify(store.news));
});

app.post("/api/news", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title || "",
    date: req.body?.date || "",
    body: req.body?.body || "",
  };
  store.news.unshift(item);
  res.status(201).type("application/json").send(JSON.stringify(item));
});

// --------- EVENTS ----------
app.get("/api/events", (req, res) => {
  res.status(200).type("application/json").send(JSON.stringify(store.events));
});

app.post("/api/events", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title || "",
    date: req.body?.date || "",
    location: req.body?.location || "",
  };
  store.events.unshift(item);
  res.status(201).type("application/json").send(JSON.stringify(item));
});

// 404 под /api (JSON)
app.use("/api", (req, res) => res.status(404).json({ error: "Not found", path: req.path }));

// Глобален error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// Корен
app.get("/", (_req, res) => res.send("LeaderTV backend OK"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("API on :" + port));
