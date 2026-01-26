-- Create advertisements table (if not exists)
-- Note: This migration may be skipped if table already exists from other migrations

CREATE TABLE IF NOT EXISTS advertisements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('jobs', 'tenders', 'general')),
    description TEXT,
    external_link VARCHAR(1000),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add optional columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='advertisements' AND column_name='external_link') THEN
        ALTER TABLE advertisements ADD COLUMN external_link VARCHAR(1000);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='advertisements' AND column_name='image_url') THEN
        ALTER TABLE advertisements ADD COLUMN image_url VARCHAR(500);
    END IF;
END $$;

-- Create indexes safely
CREATE INDEX IF NOT EXISTS idx_advertisements_category ON advertisements(category);
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(is_active);
