-- Contact Information Seed Data
-- Inserts primary office contact information

INSERT INTO contact_info (location_name, address, phone, email, fax, office_hours, is_primary, display_order) VALUES
(
    'Head Office',
    '1, Constitution Avenue, G-5/2, Islamabad, Pakistan',
    '+92 51 9225395-99',
    'info@pcsir.gov.pk',
    '+92 51 9202120',
    'Monday - Thursday: 9:00 AM - 5:00 PM
Friday: 9:00 AM - 1:00 PM
Saturday - Sunday: Closed',
    true,
    1
)
ON CONFLICT DO NOTHING;
