-- =========================
-- HISTORY ENTRIES
-- =========================
INSERT INTO history_entries (year, title, description)
VALUES
('1953', 'Foundation', 'PCSIR established to promote scientific and industrial research for national development.'),
('1973', 'PCSIR Act', 'Legal framework established through PCSIR Act 1973, defining organizational mandate.'),
('1990s', 'Expansion', 'Network of laboratories expanded across major cities in Pakistan.'),
('2000s', 'Modernization', 'ISO 17025 accreditation achieved, modernizing testing and calibration facilities.'),
('Present', 'Innovation Hub', 'Leading Pakistan''s R&D efforts in emerging technologies and industrial solutions.')
ON CONFLICT (year) DO NOTHING;

