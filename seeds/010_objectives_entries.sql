-- =========================
-- OBJECTIVES ENTRIES
-- =========================
INSERT INTO objectives_entries (num, title, description)
VALUES
('01', 'Research Excellence', 'Conduct cutting-edge research in science and technology to address national challenges.'),
('02', 'Industrial Support', 'Provide technical assistance and solutions to enhance industrial productivity.'),
('03', 'Capacity Building', 'Train scientists and technicians to build a skilled workforce for Pakistan.'),
('04', 'Technology Transfer', 'Facilitate adoption of modern technologies in local industries.'),
('05', 'Standards & Quality', 'Ensure quality assurance and standardization across industrial sectors.'),
('06', 'Innovation Ecosystem', 'Foster collaboration between academia, industry, and research institutions.')
ON CONFLICT (num) DO NOTHING;
