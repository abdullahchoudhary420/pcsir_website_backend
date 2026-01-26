-- Migration: Undo status column addition
-- Drops the status column from publications

ALTER TABLE publications DROP COLUMN IF EXISTS status;
