export default function handler(req, res) {
  res.status(200).json([
    { id: 1, name: "Събитие 1", date: "2025-09-10", location: "София" },
    { id: 2, name: "Събитие 2", date: "2025-09-15", location: "Пловдив" }
  ]);
}
