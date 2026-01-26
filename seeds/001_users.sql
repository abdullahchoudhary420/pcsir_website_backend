-- Seed Admin User (Password: admin123)
INSERT INTO users (username, password)
SELECT 'admin', '$2b$10$9POOt9VbADqFeEDJNfwpxuTVAA1wcnqsHmGEUNRlzK2ZZGCKBjJ6S'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
ON CONFLICT DO NOTHING;
