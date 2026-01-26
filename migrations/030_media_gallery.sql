-- Create media_events table
CREATE TABLE IF NOT EXISTS media_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create media_images table
CREATE TABLE IF NOT EXISTS media_images (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES media_events(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster retrieval by event
CREATE INDEX IF NOT EXISTS idx_media_images_event_id ON media_images(event_id);
