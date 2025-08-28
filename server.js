import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// примерни ендпойнти – замени с твоите:
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'local' });
});

// TODO: тук добави твоите реални маршрути, например:
// app.get('/api/news', ...);
// app.post('/api/news', ...);
// и т.н.

const PORT = process.env.PORT || 3001;

// Vercel: експортираме app (без да слушаме порт)
// Локално: слушаме порт
const isVercel = !!process.env.VERCEL;

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

// Експорт за Vercel (@vercel/node ще използва това)
export default app;
