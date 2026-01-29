-- Migration: Add missing columns to advertisements table
-- Required for seed 017_advertisements.sql

ALTER TABLE advertisements 
ADD COLUMN IF NOT EXISTS deadline DATE,
ADD COLUMN IF NOT EXISTS link VARCHAR(500),
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
