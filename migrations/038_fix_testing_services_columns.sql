-- Migration: Add missing columns to testing_services table
-- Required for seed 016_testing_training.sql

ALTER TABLE testing_services 
ADD COLUMN IF NOT EXISTS icon VARCHAR(50),
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS services_list TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create training_programs table
CREATE TABLE IF NOT EXISTS training_programs (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    program_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES training_programs(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
