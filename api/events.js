// api/events.js
import { Router } from "express";
const router = Router();

let events = []; 

// GET /api/events  -> []
router.get("/events", (req, res) => {
  res.json(events);
});

// POST /api/events
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
