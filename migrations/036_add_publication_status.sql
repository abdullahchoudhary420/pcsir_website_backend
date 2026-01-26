-- Migration: Add status column to publications
-- Adds status column to support approval workflow (draft/published)

ALTER TABLE publications 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft';

-- Create index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
