-- Site Settings (Global Key-Value Pairs)
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT,
    description VARCHAR(255),
    group_name VARCHAR(50) -- 'general', 'hero', 'contact', 'footer'
);

-- Services (Core Capabilities)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    link VARCHAR(255),
    display_order INTEGER DEFAULT 0
);

-- Statistics (Home Page Stats)
CREATE TABLE IF NOT EXISTS statistics (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Social Links
CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(50)
);
