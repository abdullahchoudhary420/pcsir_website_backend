-- Migration: Feedback Submissions Table
-- Creates table for public feedback submissions

CREATE TABLE IF NOT EXISTS feedback_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    feedback_type VARCHAR(50) DEFAULT 'general',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback_submissions(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback_submissions(feedback_type);
