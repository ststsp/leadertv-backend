import express from "express";
import cors from "cors";
import health from "./api/health.js";
import news from "./api/news.js";
import events from "./api/events.js";
import ping from "./api/ping.js"; 

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://www.leadertv.org",
    "https://leadertv.org",
    "https://<https://leadertv-frontend-ready-git-main-ststsps-projects.vercel.app"
  ],
}));

app.use("/api", health);
app.use("/api", news);     
app.use("/api", events);   
app.use("/api", ping);     

app.use("/api", (req, res) => res.status(404).json({ error: "Not found", path: req.path }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.get("/", (_, res) => res.send("LeaderTV backend OK"));
const port = process.env.PORT || 8080;
app.listen(port, () => console.log("API on :" + port));
