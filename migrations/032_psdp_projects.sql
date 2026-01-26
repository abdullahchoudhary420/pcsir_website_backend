CREATE TABLE IF NOT EXISTS psdp_projects (
    id SERIAL PRIMARY KEY,
    serial_no VARCHAR(50),
    psdp_no VARCHAR(50),
    name TEXT NOT NULL,
    approval_status VARCHAR(100),
    cost_total VARCHAR(50),
    cost_foreign_aid VARCHAR(50),
    psdp_foreign_aid VARCHAR(50),
    psdp_rupees VARCHAR(50),
    psdp_total VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for ordering
CREATE INDEX idx_psdp_projects_serial_no ON psdp_projects(serial_no);
