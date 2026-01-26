-- Banner Configuration Table
CREATE TABLE IF NOT EXISTS banner_config (
    id SERIAL PRIMARY KEY,
    enabled BOOLEAN DEFAULT true,
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    show_duration INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default banner configuration
INSERT INTO banner_config (enabled, title, subtitle, cta_text, cta_link, show_duration)
VALUES (
    true,
    'Welcome to PCSIR',
    'Leading Innovation in Science & Technology Since 1953',
    'Explore Our Research',
    '/units',
    10
);
