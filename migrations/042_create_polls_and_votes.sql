-- Create Polls table
CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Create Poll Options table
CREATE TABLE IF NOT EXISTS poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Create Poll Votes table (to track unique votes)
CREATE TABLE IF NOT EXISTS poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    ip_address VARCHAR(45), -- Supports IPv6
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Add unique constraint to prevent multiple votes from same IP on same poll
    -- (Can be adjusted based on requirements, e.g., allow multiple votes from same IP but different users if logged in)
    CONSTRAINT unique_vote_per_poll UNIQUE (poll_id, ip_address)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_polls_is_active ON polls(is_active);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_ip_address ON poll_votes(ip_address);
