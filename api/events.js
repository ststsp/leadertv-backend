import { sendJSON, handleOptions } from "./_utils.js";

const EVENTS = [
  { id: 1, title: "Онлайн среща на МИГ", date: "2025-09-10", place: "Онлайн" },
  { id: 2, title: "Регионален форум LEADER", date: "2025-09-24", place: "София" },
  { id: 3, title: "Обучение: управление на проекти", date: "2025-10-05", place: "Пловдив" }
];

export default function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (req.method === "GET") {
    const { id } = req.query || {};
    if (id) {
      const item = EVENTS.find(e => String(e.id) === String(id));
      return item ? sendJSON(res, item) : sendJSON(res, { message: "Not found" }, 404);
    }
    const sorted = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
    return sendJSON(res, sorted);
  }

  return sendJSON(res, { message: "Method not allowed" }, 405);
}
