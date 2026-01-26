TRUNCATE TABLE units RESTART IDENTITY CASCADE;

INSERT INTO units (name, location, specialization, phone, email, image_url) VALUES
('PCSIR Laboratories Complex, Karachi', 'Karachi, Sindh', 'Chemical, Food, Pharmaceutical Testing', '+92-21-99261789', 'karachi@pcsir.gov.pk', '/uploads/units/karachi.jpg'),
('PCSIR Laboratories Complex, Lahore', 'Lahore, Punjab', 'Industrial Chemistry, Textiles, Materials', '+92-42-99230888', 'lahore@pcsir.gov.pk', '/uploads/units/skardu.jpg'),
('PCSIR Laboratories Complex, Peshawar', 'Peshawar, KPK', 'Mineral Processing, Gems & Jewelry', '+92-91-9216201', 'peshawar@pcsir.gov.pk', '/uploads/units/peshawar.png'),
('PCSIR Laboratories, Quetta', 'Quetta, Balochistan', 'Mineral Resources, Natural Products', '+92-81-9201482', 'quetta@pcsir.gov.pk', '/uploads/units/quetta.jpg'),
('PCSIR Laboratories Complex, Hyderabad', 'Hyderabad', 'Agro-Industrial Chemicals', '+92-22-9213190', 'hyderabad@pcsir.gov.pk', '/uploads/units/hyderabad.jpg'),
('PCSIR Laboratories, Islamabad', 'Islamabad', 'Physical Standards, Electronics', '+92-51-9257462', 'islamabad@pcsir.gov.pk', '/uploads/units/isl.jpg'),
('Fuel Research Centre, Karachi', 'Karachi', 'Fuel, Energy, Environmental Studies', '+92-21-34641571', 'frc@pcsir.gov.pk', '/uploads/units/fuel research centre karachi.jpeg'),
('Leather Research Centre, Karachi', 'Karachi', 'Leather Technology, Training', '+92-21-32578505', 'lrc@pcsir.gov.pk', '/uploads/units/Leather Research Centre, Karachi.png'),
('Scientific Information Centre, Karachi', 'Karachi', 'Scientific Information, Publications', '+92-21-34642050', 'sic@pcsir.gov.pk', '/uploads/units/sic-karachi.jpg'),
('Institute of Industrial Electronics Engineering, Karachi', 'Karachi', 'Industrial Electronics, Engineering', '+92-21-99244220', 'iiee@pcsir.gov.pk', '/uploads/units/karachi.jpg'),
('Pak Swiss / Precision Systems Training Centres, PSTC Karachi', 'Karachi', 'Precision Mechanics, Instrumentation', '+92-21-99244220', 'pstck@pcsir.gov.pk', '/uploads/units/PSTC Karachi.png'),
('Pak Swiss / Precision Systems Training Centres, PSTC Lahore', 'Lahore', 'Precision Mechanics, Dies & Moulds', '+92-42-35334781', 'pstcl@pcsir.gov.pk', '/uploads/units/Precision-Lahore.png'),
('Pak Swiss / Precision Systems Training Centres, PSTC Peshawar', 'Peshawar', 'Precision Mechanics', '+92-91-9217180', 'pstcp@pcsir.gov.pk', '/uploads/units/peshawar.png'),
('Pak Swiss / Precision Systems Training Centres, PSTC Quetta', 'Quetta', 'Precision Mechanics', '+92-81-2821262', 'pstcq@pcsir.gov.pk', '/uploads/units/PSTC, Quetta.png')
ON CONFLICT DO NOTHING;
