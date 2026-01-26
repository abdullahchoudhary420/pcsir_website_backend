CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    specialization TEXT,
    phone VARCHAR(50),
    email VARCHAR(255)
);
