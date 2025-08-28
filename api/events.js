export default function handler(req, res) {
  res.status(200).json([
    { id: 1, title: "Онлайн среща на МИГ", date: "2025-09-10", place: "Онлайн" },
    { id: 2, title: "Регионален форум LEADER", date: "2025-09-24", place: "София" }
  ]);
}
