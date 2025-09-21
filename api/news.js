import { Router } from "express";
const router = Router();

let news = [];

router.get("/news", (req, res) => res.json(news));

router.post("/news", (req, res) => {
  const item = { id: Date.now().toString(), title: req.body.title || "", date: req.body.date || "", body: req.body.body || "" };
  news.unshift(item);
  res.status(201).json(item);
});

router.put("/news/:id", (req, res) => {
  const i = news.findIndex(n => (n.id || n._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  news[i] = { ...news[i], ...req.body };
  res.json(news[i]);
});

router.delete("/news/:id", (req, res) => {
  news = news.filter(n => (n.id || n._id) !== req.params.id);
  res.sendStatus(204);
});

export default router;
