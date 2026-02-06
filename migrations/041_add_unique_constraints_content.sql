-- Migration: Add Unique Constraints to Content Tables
-- Prevents duplicate entries when seeding data

CREATE UNIQUE INDEX IF NOT EXISTS idx_scope_areas_title_unique ON scope_areas(title);
CREATE UNIQUE INDEX IF NOT EXISTS idx_testing_services_title_unique ON testing_services(title);
CREATE UNIQUE INDEX IF NOT EXISTS idx_training_programs_name_unique ON training_programs(program_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_unique ON courses(program_id, course_name);
