-- Migration: Add new fields to testing_services table

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='testing_services' AND column_name='approximate_time') THEN
        ALTER TABLE testing_services ADD COLUMN approximate_time VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='testing_services' AND column_name='testing_method') THEN
        ALTER TABLE testing_services ADD COLUMN testing_method VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='testing_services' AND column_name='services_available') THEN
        ALTER TABLE testing_services ADD COLUMN services_available VARCHAR(100);
    END IF;
END $$;
