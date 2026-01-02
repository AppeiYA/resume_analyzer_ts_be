ALTER TABLE resumes
ALTER COLUMN overall_score TYPE INTEGER
USING ROUND(overall_score);
