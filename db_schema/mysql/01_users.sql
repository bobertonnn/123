
-- Table to store user profile information
CREATE TABLE users (
    id VARCHAR(255) NOT NULL PRIMARY KEY, -- Firebase UID
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url VARCHAR(2048),
    signature_url TEXT,                 -- Can be a long Data URI
    user_tag VARCHAR(255) UNIQUE,
    join_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_tag ON users(user_tag);
