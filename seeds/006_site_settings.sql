-- =========================
-- SITE SETTINGS
-- =========================
INSERT INTO site_settings (key, value, description, group_name) VALUES
('hero_badge', 'Established 1953', 'Hero badge text', 'hero'),
('hero_title', 'Pakistan''s Premier R&D Organization', 'Main hero title', 'hero'),
('hero_subtitle', 'Driving Innovation in Science & Technology', 'Hero subtitle', 'hero'),
('hero_description',
 'Providing cost-effective technology solutions and advancing industrial development through research and innovation.',
 'Hero description text', 'hero'),
('hero_video_url', '/video/PCSIR_v.mp4', 'Hero background video', 'hero'),

('cta_title', 'Ready to Collaborate?', 'CTA heading', 'general'),
('cta_description', 'Partner with PCSIR for cutting-edge research and development solutions.', 'CTA description', 'general'),
('cta_button_text', 'Get in Touch', 'CTA button text', 'general'),
('cta_button_link', '/contact', 'CTA button link', 'general'),

('info_section_title', 'PCSIR Information', 'Info section heading', 'general'),
('about_section_title', 'About PCSIR', 'About section heading', 'general'),
('services_section_title', 'Our Core Capabilities', 'Services section heading', 'general'),
('news_section_title', 'Latest News & Updates', 'News section heading', 'general')
ON CONFLICT (key) DO NOTHING;

-- =========================
-- SERVICES
-- =========================
INSERT INTO services (title, description, icon, link, display_order) VALUES
('Industrial Testing',
 'Comprehensive testing services for textiles, chemicals, food, and pharmaceuticals in accordance with international standards.',
 'FaFlask', '/testing-training', 1),

('Calibration Services',
 'High-precision calibration services ensuring accuracy and compliance for industrial equipment.',
 'FaCog', '/testing-training', 2),

('Technical Training',
 'Professional training programs, diplomas, and workshops to develop skilled technical manpower.',
 'FaGraduationCap', '/testing-training', 3),

('R&D Consultancy',
 'Expert consultancy services for industrial troubleshooting, process optimization, and technology development.',
 'FaLightbulb', '/contact', 4)
ON CONFLICT DO NOTHING;

-- =========================
-- STATISTICS
-- =========================
INSERT INTO statistics (value, label, display_order) VALUES
('14+', 'Research Laboratories', 1),
('6', 'Training Centers', 2),
('ISO 17025', 'Certified Labs', 3),
('70+', 'Years of Excellence', 4)
ON CONFLICT DO NOTHING;

-- =========================
-- SOCIAL LINKS
-- =========================
INSERT INTO social_links (platform, url, icon) VALUES
('Facebook', 'https://www.facebook.com/PCSIR', 'FaFacebook'),
('Twitter', 'https://twitter.com/PCSIR', 'FaTwitter'),
('LinkedIn', 'https://www.linkedin.com/company/pcsir', 'FaLinkedin'),
('YouTube', 'https://www.youtube.com/@PCSIR', 'FaYoutube')
ON CONFLICT DO NOTHING;
