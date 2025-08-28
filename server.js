// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ---- примерни API маршрути ----
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: "vercel-or-local" });
});

// TODO: замени със своите реални маршрути
app.get("/api/news", (req, res) => {
  res.json([{ id: 1, title: "Demo news" }]);
});

app.get("/api/events", (req, res) => {
  res.json([{ id: 1, title: "Demo event" }]);
});

// ---- Vercel handler ----
// На Vercel НЯМА да слушаме порт. Просто export-ваме handler-а:
export default (req, res) => app(req, res);

// ---- Локално стартиране ----
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}
