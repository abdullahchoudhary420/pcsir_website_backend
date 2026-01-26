-- =========================
-- ABOUT ENTRIES
-- =========================
INSERT INTO about_entries (section, title, content, display_order) VALUES
('about', 'About PCSIR',
 'The Pakistan Council of Scientific and Industrial Research (PCSIR) was established in 1953 to conduct, promote, and coordinate scientific and industrial research in Pakistan.',
 1),

('about', 'Network of Laboratories',
 'PCSIR operates a network of research laboratories and institutes across Pakistan, specializing in food technology, chemistry, biotechnology, minerals, fuels, and physical sciences.',
 2),

('founder', 'Founder',
 'Dr. Salimuzzaman Siddiqui (SI, HI, NI) was a renowned Pakistani scientist and natural products chemist who founded PCSIR and served as its first chairman.',
 1),

('achievement', 'Research Excellence',
 'PCSIR has successfully completed hundreds of research and development projects supporting national industries.',
 1),

('achievement', 'Industry Support',
 'PCSIR provides testing, calibration, and consultancy services to thousands of industries nationwide.',
 2)
ON CONFLICT DO NOTHING;
