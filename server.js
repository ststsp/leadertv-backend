import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Примерни маршрути:
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" });
});

// добави тук останалите ти API маршрути, например:
// app.get("/api/news", ...);
// app.post("/api/news", ...);

// За удобство: коренът да връща кратък текст (за да не виждаш 404)
app.get("/", (req, res) => {
  res.send("LeaderTV backend is up. Try GET /api/health");
});

// ЕКСПОРТ за Vercel (serverless)
const handler = serverless(app);
export default handler;
export { handler };
