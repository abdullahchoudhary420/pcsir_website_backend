-- Migration: Fix testing_services name column constraint
-- The seed file uses 'title' instead of 'name', so we need to make 'name' nullable

ALTER TABLE testing_services ALTER COLUMN name DROP NOT NULL;
