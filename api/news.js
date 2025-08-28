export default function handler(req, res) {
  const news = [
    { id: 1, title: "Старт на LeaderTV", date: "2025-08-14" },
    { id: 2, title: "Уебинар за добри практики", date: "2025-09-05" },
  ];
  res.status(200).json(news);
}
