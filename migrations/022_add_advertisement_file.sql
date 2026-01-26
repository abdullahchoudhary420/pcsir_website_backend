-- Migration: Add file_url column to advertisements table

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='advertisements' AND column_name='file_url') THEN
        ALTER TABLE advertisements ADD COLUMN file_url VARCHAR(500);
    END IF;
END $$;
