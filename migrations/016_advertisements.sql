-- Migration: Create advertisements table
-- For managing Jobs, Tenders, and General announcements

CREATE TABLE IF NOT EXISTS advertisements (
    id SERIAL PRIMARY KEY,
    category VARCHAR(20) NOT NULL CHECK (category IN ('jobs', 'tenders', 'general')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    link VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
