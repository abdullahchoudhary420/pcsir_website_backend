-- Migration: Fix services_available format in testing_services table
-- Converts PostgreSQL array format {"SL","KLC","IL"} to comma-separated string SL,KLC,IL

UPDATE testing_services
SET services_available = 
    TRIM(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(services_available, '{', ''),
                    '}', ''
                ),
                '"', ''
            ),
            ' ', ''
        )
    )
WHERE services_available IS NOT NULL 
  AND services_available != ''
  AND services_available LIKE '{%}';
