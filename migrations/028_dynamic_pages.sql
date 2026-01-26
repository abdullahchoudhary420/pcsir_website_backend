-- Add is_chairman field to senior_management table
ALTER TABLE senior_management 
ADD COLUMN IF NOT EXISTS is_chairman BOOLEAN DEFAULT FALSE;

-- Create unique constraint to ensure only one chairman
DROP INDEX IF EXISTS unique_chairman;
CREATE UNIQUE INDEX unique_chairman ON senior_management (is_chairman) WHERE is_chairman = TRUE;

-- Update existing chairman data (Dr. Syed Hussain Abidi)
UPDATE senior_management 
SET is_chairman = TRUE 
WHERE name = 'Dr. Syed Hussain Abidi (S.I)' OR designation LIKE '%Chairman%';

-- Add category field to pensioners_cell_items for better organization
ALTER TABLE pensioners_cell_items 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general_info';

-- Update sample data with categories
UPDATE pensioners_cell_items SET category = 'contact_person' WHERE title LIKE '%Person%' OR title LIKE '%Officer%';
