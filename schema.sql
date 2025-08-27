-- ===========================
--  SQLite schema for LeaderTV
-- ===========================

-- Новини
CREATE TABLE IF NOT EXISTS news (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  title    TEXT    NOT NULL,
  date     TEXT    NOT NULL,   -- ISO формат: YYYY-MM-DD
  summary  TEXT,
  link     TEXT
);

-- Събития
CREATE TABLE IF NOT EXISTS events (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  title    TEXT    NOT NULL,
  start    TEXT    NOT NULL,   -- ISO формат: YYYY-MM-DDTHH:mm
  location TEXT
);
