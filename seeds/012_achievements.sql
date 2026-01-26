-- =========================
-- ACHIEVEMENTS ENTRIES
-- =========================
INSERT INTO achievements_entries (icon, title, description)
VALUES
('🏆', 'ISO Certification', 'All major laboratories ISO 17025 accredited for testing and calibration'),
('📚', 'Publications', 'Thousands of research papers published in international journals'),
('🎓', 'Training Programs', 'Over 10,000 professionals trained through PSTC and IIEE'),
('💡', 'Innovations', 'Numerous patents and indigenous technologies developed')
ON CONFLICT (title) DO NOTHING;
