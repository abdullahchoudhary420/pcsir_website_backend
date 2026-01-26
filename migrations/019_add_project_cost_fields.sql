-- Migration: Add cost-related fields to projects table

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS demand_by_pcsir DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS allocation TEXT,
ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10, 2);
