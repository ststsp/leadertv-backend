import { Router } from "express";
const router = Router();

// само този конкретен път (никакви catch-all!)
router.get("/ping", (_req, res) => {
  res.json({ pong: true });
});

export default router;
