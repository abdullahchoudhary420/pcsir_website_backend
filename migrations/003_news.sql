-- News Table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    date VARCHAR(100), -- Keeping as string for now to match frontend format
    title VARCHAR(255) NOT NULL,
    description TEXT
);
