-- Migration: Content Pages Tables
-- Creates scope_areas, testing_services, training_programs, and courses tables

-- Scope Areas Table
CREATE TABLE IF NOT EXISTS scope_areas (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testing Services Table
CREATE TABLE IF NOT EXISTS testing_services (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    services_list TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training Programs Table
CREATE TABLE IF NOT EXISTS training_programs (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    program_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES training_programs(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
