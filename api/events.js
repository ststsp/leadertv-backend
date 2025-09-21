import { Router } from "express";
const router = Router();

let events = [];

router.get("/events", (req, res) => res.json(events));

router.post("/events", (req, res) => {
  const item = { id: Date.now().toString(), title: req.body.title || "", date: req.body.date || "", location: req.body.location || "" };
  events.unshift(item);
  res.status(201).json(item);
});

router.put("/events/:id", (req, res) => {
  const i = events.findIndex(e => (e.id || e._id) === req.params.id);
  if (i === -1) return res.sendStatus(404);
  events[i] = { ...events[i], ...req.body };
  res.json(events[i]);
});

router.delete("/events/:id", (req, res) => {
  events = events.filter(e => (e.id || e._id) !== req.params.id);
  res.sendStatus(204);
});

export default router;
