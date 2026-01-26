-- Migration: Dynamic Content Tables for Admin Sections
-- Replaces static_pages with 5 separate tables for full CRUD functionality

-- Drop old static_pages table if it exists
DROP TABLE IF EXISTS static_pages CASCADE;

-- PCSIR Act Items Table
CREATE TABLE IF NOT EXISTS pcsir_act_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    document_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pensioners Cell Items Table
CREATE TABLE IF NOT EXISTS pensioners_cell_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Senior Management Table
CREATE TABLE IF NOT EXISTS senior_management (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SIFC Items Table
CREATE TABLE IF NOT EXISTS sifc_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'focus_area',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Right to Information Items Table
CREATE TABLE IF NOT EXISTS right_to_information_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    document_url VARCHAR(500),
    category VARCHAR(50) DEFAULT 'document',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO pcsir_act_items (title, content, display_order) VALUES
('PCSIR Act Overview', 'The Pakistan Council of Scientific and Industrial Research (PCSIR) was established under the PCSIR Act to promote scientific and industrial research in Pakistan.', 1),
('Powers and Functions', 'PCSIR has the authority to establish research laboratories, conduct scientific investigations, and provide technical services to industries.', 2);

INSERT INTO pensioners_cell_items (title, description, contact_person, contact_email, display_order) VALUES
('Pension Services', 'Assistance with pension-related queries and documentation for retired PCSIR employees.', 'Pension Officer', 'pension@pcsir.gov.pk', 1),
('Medical Benefits', 'Information about medical benefits and reimbursement procedures for pensioners.', 'HR Department', 'hr@pcsir.gov.pk', 2);

INSERT INTO senior_management (name, designation, display_order) VALUES
('Chairman PCSIR', 'Chairman', 1),
('Director General', 'Director General', 2);

INSERT INTO sifc_items (title, description, category, display_order) VALUES
('Industrial Development', 'PCSIR collaborates with SIFC to promote industrial growth through research and innovation.', 'focus_area', 1),
('Technology Transfer', 'Facilitating technology transfer and commercialization of research outcomes.', 'focus_area', 2);

INSERT INTO right_to_information_items (title, description, category, display_order) VALUES
('RTI Application Form', 'Download the Right to Information application form.', 'form', 1),
('RTI Procedures', 'Guidelines and procedures for requesting information under the RTI Act.', 'procedure', 2);
