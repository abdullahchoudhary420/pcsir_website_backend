-- Sample Advertisements Data

-- Jobs
INSERT INTO advertisements (category, title, description, deadline, link, display_order) VALUES
('jobs', 'Scientific Officer (BS-17)', 'Applications are invited for the post of Scientific Officer in Chemistry Division', '2025-02-28', '/careers/scientific-officer-2025', 1),
('jobs', 'Research Associate (BS-18)', 'Position available for Research Associate in Food Technology Lab', '2025-03-15', '/careers/research-associate-2025', 2),
('jobs', 'Lab Technician (BS-11)', 'PCSIR Karachi requires Lab Technician for Materials Testing', '2025-02-20', '/careers/lab-tech-2025', 3)
ON CONFLICT DO NOTHING;

-- Tenders
INSERT INTO advertisements (category, title, description, deadline, link, display_order) VALUES
('tenders', 'Supply of Laboratory Equipment', 'Tender for supply and installation of analytical instruments', '2025-01-31', '/tenders/lab-equipment-2025', 1),
('tenders', 'Building Renovation - Lahore Labs', 'Construction tender for renovation of PCSIR Lahore laboratories', '2025-02-10', '/tenders/building-lahore-2025', 2),
('tenders', 'IT Infrastructure Upgrade', 'Tender for upgrading IT systems across all PCSIR centers', '2025-02-05', '/tenders/it-upgrade-2025', 3)
ON CONFLICT DO NOTHING;

-- General
INSERT INTO advertisements (category, title, description, deadline, link, display_order) VALUES
('general', 'Annual Research Conference 2025', 'Registration open for PCSIR Annual Research Conference', '2025-03-01', '/events/conference-2025', 1),
('general', 'Training Workshop on GC-MS', 'Free training workshop for industry professionals on GC-MS analysis', '2025-02-15', '/training/gcms-workshop', 2),
('general', 'Patent Filing Assistance Program', 'PCSIR offers assistance to researchers for filing patents', NULL, '/services/patent-assistance', 3)
ON CONFLICT DO NOTHING;
