import express from "express";
import cors from "cors";
import health from "./api/health.js";
import news from "./api/news.js";
import events from "./api/events.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://www.leadertv.org",
    "https://leadertv.org",
    // добави и точния Vercel домейн на проекта ти, напр.:
    "https://leadertv-frontend-ready-*.vercel.app"
  ]
}));

app.use("/api", health);
app.use("/api", news);
app.use("/api", events);

app.get("/", (_, res) => res.send("LeaderTV backend OK"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("API on :" + port));
