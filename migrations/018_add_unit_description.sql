-- Migration: Add description column to units table

ALTER TABLE units 
ADD COLUMN IF NOT EXISTS description TEXT;
