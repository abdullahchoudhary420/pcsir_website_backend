-- Info Cards Table
DROP TABLE IF EXISTS info_cards CASCADE;
CREATE TABLE IF NOT EXISTS info_cards (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50) NOT NULL,
    type VARCHAR(50) DEFAULT 'Standard', -- New column for card type
    title VARCHAR(255) NOT NULL,
    description TEXT
);
