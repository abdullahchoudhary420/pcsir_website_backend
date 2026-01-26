-- Testing Services & Training Programs Seed Data
-- Populated from existing TestingTraining.js hardcoded data

INSERT INTO testing_services (icon, title, description, services_list, display_order) VALUES
('FaFlask', 'Chemical Testing', 'Quality control and analysis for industries', 'Industrial chemicals analysis,Water & effluent testing,Petrochemical analysis,Cosmetics & toiletries', 1),
('FaCog', 'Industrial Testing', 'Comprehensive testing for textiles, food, and pharmaceuticals', 'Textile fiber & yarn testing,Food quality & safety,Pharmaceutical drug analysis,Building materials testing', 2),
('FaCertificate', 'Calibration Services', 'ISO/IEC 17025 accredited calibration services', 'Mass & weight calibration,Temperature instruments,Pressure & vacuum gauges,Dimensional metrology', 3)
ON CONFLICT DO NOTHING;

INSERT INTO training_programs (icon, program_name, institution, description, display_order) VALUES
('FaGraduationCap', 'PCSIR Science & Technology Centre (PSTC)', 'PCSIR', 'Professional diploma courses in various technical disciplines for skill development.', 1),
('FaGraduationCap', 'Institute of Industrial Electronics Engineering (IIEE)', 'PCSIR', 'Specialized training in electronics, instrumentation, and automation technologies.', 2)
ON CONFLICT DO NOTHING;

INSERT INTO courses (program_id, course_name, duration) VALUES
(1, 'Industrial Chemistry', '6 months'),
(1, 'Textile Technology', '6 months'),
(1, 'Food Technology', '6 months'),
(1, 'Quality Control & Assurance', '6 months'),
(1, 'Analytical Techniques', '6 months'),
(2, 'Industrial Electronics', '6 months'),
(2, 'Microprocessor Applications', '6 months'),
(2, 'PLC Programming', '6 months'),
(2, 'Instrumentation & Control', '6 months'),
(2, 'Industrial Automation', '6 months')
ON CONFLICT DO NOTHING;
