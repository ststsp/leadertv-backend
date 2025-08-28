import { sendJSON, handleOptions } from "./_utils.js";

// демо набор; по-късно ще дойдат от БД
const NEWS = [
  { id: 1, title: "Стартира платформата LeaderTV", date: "2025-08-14" },
  { id: 2, title: "Уебинар: добри практики", date: "2025-09-05" },
  { id: 3, title: "Нова вълна от партньорства", date: "2025-09-20" }
];

export default function handler(req, res) {
  if (handleOptions(req, res)) return;

  // GET /api/news  → лист
  if (req.method === "GET") {
    const { id } = req.query || {};
    if (id) {
      const item = NEWS.find(n => String(n.id) === String(id));
      return item ? sendJSON(res, item) : sendJSON(res, { message: "Not found" }, 404);
    }
    // може да сортираме по дата низходящо
    const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
    return sendJSON(res, sorted);
  }

  // други методи (за в бъдеще)
  return sendJSON(res, { message: "Method not allowed" }, 405);
}
