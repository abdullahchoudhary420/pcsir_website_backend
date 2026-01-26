-- Insert pre-existing Senior Management data
INSERT INTO senior_management (name, designation, bio, image_url, email, phone, display_order, is_chairman) VALUES
('Dr. Syed Hussain Abidi (S.I)', 'Chairman', 'Leading Pakistan''s premier scientific and industrial research organization, driving innovation and technological advancement for national development.', 'http://www.pcsir.gov.pk/uploads/1618303913_ChairmanPCSIR.jpeg', NULL, NULL, 1, TRUE),
('Engr. Sohail Ameer Marwat', 'Member Technology', NULL, 'http://www.pcsir.gov.pk/uploads/1586854444_EngrSohail.jpg', NULL, NULL, 2, FALSE),
('Dr. Naheed Kausar', 'Member Science', NULL, 'https://via.placeholder.com/300x300?text=Member+Science', NULL, NULL, 3, FALSE),
('Muhammad Inam Ul Haq', 'Member Finance', NULL, 'https://via.placeholder.com/300x300?text=Member+Finance', NULL, NULL, 4, FALSE),
('Mr. Tanveer Ahmad Khan', 'Secretary', NULL, 'http://www.pcsir.gov.pk/uploads/1707907994_1tan.jpeg', NULL, NULL, 5, FALSE),
('Dr. Razia Sultana', 'D.G. PCSIR Labs Complex, Karachi', NULL, 'https://via.placeholder.com/300x300?text=DG+Karachi', NULL, NULL, 6, FALSE),
('Dr. Ijaz Ahmad', 'D.G. PCSIR Labs Complex, Lahore', NULL, 'https://via.placeholder.com/300x300?text=DG+Lahore', NULL, NULL, 7, FALSE),
('Dr. Sarwat Ismail', 'D.G. PCSIR Labs Complex, Peshawar', NULL, 'https://via.placeholder.com/300x300?text=DG+Peshawar', NULL, NULL, 8, FALSE)
ON CONFLICT DO NOTHING;

-- Insert pre-existing Pensioners Cell data

-- Services
INSERT INTO pensioners_cell_items (title, description, contact_person, contact_email, contact_phone, display_order, category) VALUES
('Pension Processing', 'Efficient processing of pension claims and timely disbursement of monthly pensions', NULL, NULL, NULL, 1, 'service'),
('Query Resolution', 'Addressing pensioner queries and concerns regarding pension matters', NULL, NULL, NULL, 2, 'service'),
('Documentation Support', 'Assistance with required documentation and verification processes', NULL, NULL, NULL, 3, 'service')
ON CONFLICT DO NOTHING;

-- Contact Persons
INSERT INTO pensioners_cell_items (title, description, contact_person, contact_email, contact_phone, display_order, category) VALUES
('Focal Person', 'Chief Accounts Officer', 'Mr. Muhammad Akram', 'caof@gmail.com', '+92-51-9225383', 4, 'focal_person'),
('Head Pension Cell', 'Accounts Officer (Pension)', 'Mr. Muhammad Saleem', NULL, '+92-51-9216071, +92-312-5211121 (Cell)', 5, 'head_pension'),
('Grievance Cell for Pensioners', 'Federal Ombudsman Secretariat - Senior Advisor (Law) / Registrar / Grievance Commissioner of Pakistan', 'Hafiz Ahsaan Ahmed Khokhar', 'ombuds.hafizahsaan@gmail.com', '+92-51-9217243', 6, 'grievance')
ON CONFLICT DO NOTHING;

-- General Information
INSERT INTO pensioners_cell_items (title, description, contact_person, contact_email, contact_phone, display_order, category) VALUES
('About Pensioner''s Cell', 'The Pensioner''s Cell at PCSIR Head Office, Islamabad is dedicated to providing support and assistance to retired employees of PCSIR. We are committed to ensuring the welfare of our pensioners and addressing their concerns promptly.', NULL, NULL, NULL, 7, 'general_info'),
('Our Services', 'Our cell handles pension-related queries, processes pension claims, and provides necessary information and support to all PCSIR pensioners across Pakistan.', NULL, NULL, NULL, 8, 'general_info')
ON CONFLICT DO NOTHING;
