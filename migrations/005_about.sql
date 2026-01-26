-- About Entries Table
CREATE TABLE IF NOT EXISTS about_entries (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL, -- e.g., 'mission', 'vision', 'history', 'objective', 'achievement'
    title VARCHAR(255),
    content TEXT,
    image_url VARCHAR(255),
    display_order INTEGER -- To control sorting within sections
);
