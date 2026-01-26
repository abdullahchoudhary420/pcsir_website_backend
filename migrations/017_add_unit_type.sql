-- Migration: Add type column to units table
-- Types: multifunctional, monofunctional, hrd

ALTER TABLE units 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'multifunctional';

-- Note: The CHECK constraint is better added after data is populated
-- If needed, run: ALTER TABLE units ADD CONSTRAINT units_type_check 
-- CHECK (type IN ('multifunctional', 'monofunctional', 'hrd'));
