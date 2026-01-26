-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the downloaded notification
INSERT INTO notifications (title, file_path, date) 
VALUES (
    'Implementation of 2% Disabaility Quota in Employment Reserved for Persons with Disabilities',
    '/uploads/notifications/disability_quota.pdf',
    '2023-10-27'
);
