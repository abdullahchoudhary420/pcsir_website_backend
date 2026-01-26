ALTER TABLE psdp_projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Ongoing';
CREATE INDEX idx_psdp_projects_status ON psdp_projects(status);
