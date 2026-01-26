-- Add image fields to existing tables

-- Projects: Add image_url
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- News: Add image_url
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Units: Add image_url
ALTER TABLE units ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Labs: Add image_url (if labs table exists)
ALTER TABLE labs ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Achievements: Add image_url (correct table name is achievements_entries)
ALTER TABLE achievements_entries ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Publications: Add cover_image
ALTER TABLE publications ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500);

-- Info Cards: Add image_url (to replace or complement icon field)
ALTER TABLE info_cards ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Banner Config: Add background_image
ALTER TABLE banner_config ADD COLUMN IF NOT EXISTS background_image VARCHAR(500);

-- Note: history_entries already has image_url field, no change needed
