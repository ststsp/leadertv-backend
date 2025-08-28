export default function handler(req, res) {
  const events = [
    { id: 1, name: "Онлайн среща на МИГ", date: "2025-09-10" },
    { id: 2, name: "Регионален форум LEADER", date: "2025-09-24" },
    { id: 3, name: "Работна група: зелени проекти", date: "2025-10-05" }
  ];

  res.status(200).json(events);
}
