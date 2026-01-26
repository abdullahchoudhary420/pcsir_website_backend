-- Update unit types based on categorization

-- Multifunctional Laboratories
UPDATE units SET type = 'multifunctional' WHERE name LIKE '%LABORATORIES COMPLEX, KARACHI%' OR name LIKE '%Karachi%';
UPDATE units SET type = 'multifunctional' WHERE name LIKE '%LABORATORIES COMPLEX, LAHORE%' OR name LIKE '%Lahore%';
UPDATE units SET type = 'multifunctional' WHERE name LIKE '%LABORATORIES COMPLEX, PESHAWAR%' OR name LIKE '%Peshawar%';
UPDATE units SET type = 'multifunctional' WHERE name LIKE '%LABORATORIES, QUETTA%' OR name LIKE '%Quetta%';
UPDATE units SET type = 'multifunctional' WHERE name LIKE '%LABORATORIES, HYDERABAD%' OR name LIKE '%Hyderabad%';

-- Monofunctional Laboratories
UPDATE units SET type = 'monofunctional' WHERE name LIKE '%LABORATORIES, ISLAMABAD%' OR name LIKE '%Islamabad%';
UPDATE units SET type = 'monofunctional' WHERE name LIKE '%FUEL RESEARCH CENTRE%';
UPDATE units SET type = 'monofunctional' WHERE name LIKE '%LEATHER RESEARCH CENTRE%';
UPDATE units SET type = 'monofunctional' WHERE name LIKE '%SCIENTIFIC INFORMATION CENTRE%' OR name LIKE '%SIC%';
UPDATE units SET type = 'monofunctional' WHERE name LIKE '%SKARDU%';

-- HRD Centres
UPDATE units SET type = 'hrd' WHERE name LIKE '%INDUSTRIAL ELECTRONICS ENGINEERING%';
UPDATE units SET type = 'hrd' WHERE name LIKE '%PAK-SWISS%' OR name LIKE '%PSTC%';
UPDATE units SET type = 'hrd' WHERE name LIKE '%PRECISION SYSTEMS%';
UPDATE units SET type = 'hrd' WHERE name LIKE '%CAST METALS%' OR name LIKE '%FOUNDRY%';
