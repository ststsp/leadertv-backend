export function sendJSON(res, data, status = 200) {
  // CORS — позволи фронтенда ти да извиква този бекенд
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (status === 204) {
    res.status(204).end();
    return;
    }

  res.status(status).json(data);
}

// опционално: отговор на OPTIONS (preflight)
export function handleOptions(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).end();
    return true;
  }
  return false;
}
