export const userQueries = {
    CREATEUSER: `
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    `,
    GETUSERBYEMAIL: `
    SELECT * FROM users WHERE email = $1
    `
}