import { Router } from "express";
const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development", time: new Date().toISOString() });
});

export default router;