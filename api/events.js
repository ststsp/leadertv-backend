import { Router } from "express";
const router = Router();

let events = [];

router.get("/events", (req, res) => {
  res.json(events);
});

router.post("/events", (req, res) => {
  const item = {
    id: Date.now().toString(),
    title: req.body?.title || "",
    date: req.body?.date || "",
    location: req.body?.location || "",
  };
  events.unshift(item);
  res.status(201).json(item);
});

export default router;
