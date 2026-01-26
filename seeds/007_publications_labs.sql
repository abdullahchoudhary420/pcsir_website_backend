INSERT INTO publications (title, type, year)
VALUES
  ('Journal of Chemical Society of Pakistan', 'Journal', '2024'),
  ('Pakistan Journal of Scientific & Industrial Research', 'Journal', '2024'),
  ('Advanced Textile Processing Techniques', 'Technical Report', '2023'),
  ('Mineral Resources of Pakistan', 'Research Paper', '2023'),
  ('Food Safety Standards Manual', 'Technical Report', '2023'),
  ('Indigenous Pharmaceutical Formulations', 'Research Paper', '2022')
ON CONFLICT DO NOTHING;


INSERT INTO labs (name, location, specialization, phone, email, website, display_order) VALUES
('PCSIR Laboratories Complex Karachi',
 'Karachi',
 'Chemistry, Food Technology, Biotechnology',
 '+92-21-99261723',
 'karachi@pcsir.gov.pk',
 'https://pcsir.gov.pk',
 1),

('PCSIR Laboratories Complex Lahore',
 'Lahore',
 'Glass & Ceramics, Minerals, Engineering',
 '+92-42-99230481',
 'lahore@pcsir.gov.pk',
 'https://pcsir.gov.pk',
 2),

('PCSIR Laboratories Complex Peshawar',
 'Peshawar',
 'Environmental Sciences, Fuels, Materials',
 '+92-91-9216534',
 'peshawar@pcsir.gov.pk',
 'https://pcsir.gov.pk',
 3)
ON CONFLICT DO NOTHING;
