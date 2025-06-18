
-- Table to store user notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,      -- Foreign key to users table (recipient of the notification)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp DATETIME NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,      -- 'read' can be a reserved keyword, using is_read
    link VARCHAR(2048),
    icon_name VARCHAR(50),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);
