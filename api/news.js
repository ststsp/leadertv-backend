export default function handler(req, res) {
  res.status(200).json([
    { id: 1, title: "Старт на платформата LeaderTV", date: "2025-08-14" },
    { id: 2, title: "Уебинар: добри практики по ЛИДЕР", date: "2025-09-05" }
  ]);
}
