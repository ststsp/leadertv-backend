import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// позволи JSON body
app.use(express.json());

// CORS — добави тук домейните ти (локално + прод)
const allowed = [
  "http://localhost:5173",
  "https://leaderTV.org",
  "https://leadertv-frontend-ready.vercel.app",
];
app.use(
  cors({
    origin(origin, cb) {
      // разрешава Postman / curl (без Origin)
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// лека проверка
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "local" });
});

// демо API — замени с реалните си handler-и
const demoNews = [
  { id: "1", title: "Стартира платформата LeaderTV", date: "2025-08-14" },
  { id: "2", title: "Добри практики по Leader", date: "2025-09-05" },
];
const demoEvents = [
  { id: "e1", title: "Онлайн среща на МИГ", date: "2025-09-10", place: "Онлайн" },
  { id: "e2", title: "Регионален форум Leader", date: "2025-09-24", place: "София" },
];

app.get("/api/news", (req, res) => res.json(demoNews));
app.get("/api/news/:id", (req, res) => {
  const n = demoNews.find((x) => x.id === req.params.id);
  if (!n) return res.status(404).json({ error: "Not found" });
  res.json(n);
});

app.get("/api/events", (req, res) => res.json(demoEvents));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
