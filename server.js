import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Тестов маршрут за админ логин
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_SECRET) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Невалидна парола" });
  }
});

// Тук ще добавиш останалите API маршрути за новини и събития
// app.get("/api/news", ... )
// app.post("/api/news", ... )
// app.delete("/api/news/:id", ... )

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
