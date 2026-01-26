-- Active Projects
INSERT INTO projects (title, category, status, description, duration) VALUES
('Sustainable Textile Dyeing Technologies', 'Textiles', 'Active', 'Development of eco-friendly dyeing processes for textile industry.', '2023 - 2025'),
('Indigenous Pharmaceutical Development', 'Pharmaceuticals', 'Active', 'Research on local herbal medicines and drug formulations.', '2024 - 2026'),
('Food Safety & Quality Assurance', 'Food Science', 'Active', 'Advanced testing methods for food contamination detection.', '2023 - 2024')
ON CONFLICT DO NOTHING;

-- Completed Projects
INSERT INTO projects (title, category, status, description, duration) VALUES
('Industrial Waste Water Treatment', 'Environment', 'Completed', 'Developed cost-effective solutions for industrial effluent treatment.', '2020 - 2023'),
('Mineral Processing Technologies', 'Minerals', 'Completed', 'Value addition techniques for local mineral resources.', '2019 - 2022')
ON CONFLICT DO NOTHING;
