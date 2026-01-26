-- =========================
-- CREATE ACHIEVEMENTS_ENTRIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS achievements_entries (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL
);
