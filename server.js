
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let events = [
  { id: 1, title: "Примерно събитие", date: "2025-08-15", location: "София", description: "Описание на събитието." }
];

let news = [
  { id: 1, title: "Новина", content: "Съдържание на новината", date: "2025-08-01" }
];

// API routes
app.get('/api/events', (req, res) => res.json(events));
app.post('/api/events', (req, res) => {
  const newEvent = { id: events.length + 1, ...req.body };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.get('/api/news', (req, res) => res.json(news));
app.post('/api/news', (req, res) => {
  const newArticle = { id: news.length + 1, date: new Date().toISOString().slice(0, 10), ...req.body };
  news.push(newArticle);
  res.status(201).json(newArticle);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
