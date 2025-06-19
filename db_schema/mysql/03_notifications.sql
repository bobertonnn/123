
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) NOT NULL, -- Может быть UUID, генерируемый приложением
    user_id VARCHAR(255) NOT NULL, -- Firebase UID получателя уведомления
    title VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(2048) DEFAULT NULL,
    icon_name VARCHAR(50) DEFAULT NULL,
    category VARCHAR(50) DEFAULT NULL, -- e.g., 'system', 'document', 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    -- INDEX fk_notifications_user_idx (user_id ASC),
    -- CONSTRAINT fk_notifications_user
    --   FOREIGN KEY (user_id)
    --   REFERENCES users (id) -- Если у вас есть таблица users
    --   ON DELETE CASCADE
    --   ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
