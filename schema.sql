
-- Събития
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  description TEXT
);

-- Новини
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  date DATE DEFAULT CURRENT_DATE
);
