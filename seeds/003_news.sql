-- Seed News
INSERT INTO news (date, title, description)
SELECT 'December 2024', 'Dr. Hafiz Rub Nawaz Assumes Charge as Director, LRC, Karachi', 'Dr. Hafiz Rub Nawaz has assumed the charge as Director, Leather Research Centre (LRC), Karachi.'
WHERE NOT EXISTS (SELECT 1 FROM news WHERE title = 'Dr. Hafiz Rub Nawaz Assumes Charge as Director, LRC, Karachi')
ON CONFLICT DO NOTHING;

INSERT INTO news (date, title, description)
SELECT 'December 2024', 'Dr. Razia Sultana Assumes Charge as Director General, PCSIR Laboratories Complex Karachi', 'Dr. Razia Sultana has assumed the charge as Director General, PCSIR Laboratories Complex Karachi.'
WHERE NOT EXISTS (SELECT 1 FROM news WHERE title = 'Dr. Razia Sultana Assumes Charge as Director General, PCSIR Laboratories Complex Karachi')
ON CONFLICT DO NOTHING;

INSERT INTO news (date, title, description)
SELECT 'December 2024', 'Member Science at PCSIR Signs Contract Extension with SIMAP', 'Member Science at PCSIR, formally signed the contract extension with Mr. Zeeshan Tariq, Chairman of SIMAP.'
WHERE NOT EXISTS (SELECT 1 FROM news WHERE title = 'Member Science at PCSIR Signs Contract Extension with SIMAP')
ON CONFLICT DO NOTHING;
