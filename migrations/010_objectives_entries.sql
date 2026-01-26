-- =========================
-- CREATE OBJECTIVES_ENTRIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS objectives_entries (
    id SERIAL PRIMARY KEY,
    num VARCHAR(5) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);
