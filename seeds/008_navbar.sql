INSERT INTO navbar (label, path, order_index) VALUES
('Home', '/', 0),
('PCSIR Act', '/pcsir-act', 1),
('About Us', '/about', 2),
('Units', '/units', 3),
('Scope', '/scope', 4),
('Projects', '/projects', 5),
('Publications', '/publications', 6),
('Contact Us', '/contact', 7),
('Testing & Training', '/testing-training', 8)
ON CONFLICT DO NOTHING;
