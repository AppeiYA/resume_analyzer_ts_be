export const resumeQueries = {
  SAVEANALYSIS: `
    INSERT INTO resume_reports (user_id, overall_score, summary, report_details)
    VALUES ($1, $2, $3, $4)
    `,
  GETUSERPREVIOUSANALYSIS: `
  SELECT *
  FROM resume_reports
  WHERE user_id = $1
  ORDER BY created_at DESC;
  `,
  DELETERESUMEREPORT:`
  DELETE FROM resume_reports
  WHERE user_id = $1
  AND id = $2
  RETURNING *
  `
};