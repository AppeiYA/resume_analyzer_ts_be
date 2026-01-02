CREATE TABLE IF NOT EXISTS resume_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score INT, 
    summary TEXT,
    report_details JSONB, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_resume_reports_user_id ON resume_reports(user_id);