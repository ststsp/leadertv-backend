import { sendJSON, handleOptions } from "./_utils.js";

export default function handler(req, res) {
  if (handleOptions(req, res)) return;
  sendJSON(res, { ok: true, env: "vercel", time: new Date().toISOString() });
}
