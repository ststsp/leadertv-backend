import { Router } from "express";
const router = Router();

let news = []; // временно в памет

// GET /api/news  →  []
router.get("/news", (req, res) => {
  res.json(news);
});

// POST /api/news
router.post("/news", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title || "",
    date: req.body?.date || "",
    body: req.body?.body || "",
  };
  news.unshift(item);
  res.status(201).json(item);
});

export default router;
