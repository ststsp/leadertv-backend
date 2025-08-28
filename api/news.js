export default function handler(req, res) {
  const news = [
    { id: 1, title: "Старт на платформата LeaderTV", date: "2025-08-14" },
    { id: 2, title: "Уебинар: Добри практики по LEADER", date: "2025-09-05" },
    { id: 3, title: "Нова вълна от партньорства", date: "2025-09-20" }
  ];

  res.status(200).json(news);
}
