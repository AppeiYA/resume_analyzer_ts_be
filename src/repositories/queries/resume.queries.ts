export const resumeQueries = {
  SAVEANALYSIS: `
    INSERT INTO resume_reports (user_id, overall_score, summary, report_details)
    VALUES ($1, $2, $3, $4)
    `,
};