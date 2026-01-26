-- =========================
-- CREATE HISTORY_ENTRIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS history_entries (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);
