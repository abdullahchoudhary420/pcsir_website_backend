-- Scope Areas Seed Data
-- Populated from existing Scope.js hardcoded data

INSERT INTO scope_areas (icon, title, description, display_order) VALUES
('FaFlask', 'Chemical Research', 'Industrial chemistry, organic synthesis, polymer science, and chemical engineering solutions.', 1),
('FaIndustry', 'Industrial Development', 'Process optimization, plant troubleshooting, and technology upgradation for industries.', 2),
('FaSeedling', 'Food & Agriculture', 'Food safety testing, agricultural product research, and value addition technologies.', 3),
('FaCog', 'Engineering & Technology', 'Mechanical systems, instrumentation, electronics, and industrial automation.', 4),
('FaMicroscope', 'Materials Science', 'Metallurgy, ceramics, composites, and advanced materials characterization.', 5),
('FaPills', 'Pharmaceuticals', 'Drug analysis, quality control, pharmacology research, and herbal medicines.', 6)
ON CONFLICT DO NOTHING;
