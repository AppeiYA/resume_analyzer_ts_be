DROP INDEX IF EXISTS idx_users_email ON users(email);
DROP INDEX IF EXISTS idx_users_status ON users(status);
DROP TABLE IF EXISTS users;