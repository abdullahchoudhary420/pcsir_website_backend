-- Migration: Add performance indexes
-- Creates indexes for search and sorting optimization
-- Uses DO blocks to safely create indexes only if columns exist

-- Projects indexes
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='category') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='status') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    END IF;
END $$;

-- News indexes
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='date') THEN
        CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
    END IF;
END $$;

-- Publications indexes
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='publications' AND column_name='year') THEN
        CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='publications' AND column_name='type') THEN
        CREATE INDEX IF NOT EXISTS idx_publications_type ON publications(type);
    END IF;
END $$;

-- Units indexes
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='location') THEN
        CREATE INDEX IF NOT EXISTS idx_units_location ON units(location);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='type') THEN
        CREATE INDEX IF NOT EXISTS idx_units_type ON units(type);
    END IF;
END $$;

-- Labs indexes
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='labs' AND column_name='location') THEN
        CREATE INDEX IF NOT EXISTS idx_labs_location ON labs(location);
    END IF;
END $$;

-- Contact submissions indexes  
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='contact_submissions') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_submissions' AND column_name='submitted_at') THEN
            CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(submitted_at DESC);
        END IF;
    END IF;
END $$;

-- Navbar display order
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='navbar' AND column_name='display_order') THEN
        CREATE INDEX IF NOT EXISTS idx_navbar_display_order ON navbar(display_order);
    END IF;
END $$;

-- About entries display order
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='about_entries' AND column_name='display_order') THEN
        CREATE INDEX IF NOT EXISTS idx_about_entries_display_order ON about_entries(display_order);
    END IF;
END $$;
