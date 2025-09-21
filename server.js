import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://leadertv-frontend-ready.vercel.app", // смени с реалния ти vercel домейн
    "https://www.leadertv.org",
    "https://leadertv.org",
  ],
}));

let news = [];
let events = [];

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// NEWS
app.get("/api/news", (req, res) => res.json(news));
app.post("/api/news", (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  news.unshift(item);
  res.status(201).json(item);
});
app.put("/api/news/:id", (req, res) => {
  const i = news.findIndex(n => (n.id || n._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  news[i] = { ...news[i], ...req.body };
  res.json(news[i]);
});
app.delete("/api/news/:id", (req, res) => {
  news = news.filter(n => (n.id || n._id) !== req.params.id);
  res.sendStatus(204);
});

// EVENTS
app.get("/api/events", (req, res) => res.json(events));
app.post("/api/events", (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  events.unshift(item);
  res.status(201).json(item);
});
app.put("/api/events/:id", (req, res) => {
  const i = events.findIndex(e => (e.id || e._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  events[i] = { ...events[i], ...req.body };
  res.json(events[i]);
});
app.delete("/api/events/:id", (req, res) => {
  events = events.filter(e => (e.id || e._id) !== req.params.id);
  res.sendStatus(204);
});

app.get("/", (_, res) => res.send("LeaderTV backend OK"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("API on :" + port));
