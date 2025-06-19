
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(255) NOT NULL, -- Может быть UUID, генерируемый приложением
    user_id VARCHAR(255) NOT NULL, -- Firebase UID владельца контакта
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    avatar VARCHAR(2048) DEFAULT NULL, -- URL к аватару
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    -- INDEX fk_contacts_user_idx (user_id ASC), -- Опциональный индекс для user_id
    -- Ограничение внешнего ключа, если у вас есть таблица users:
    -- CONSTRAINT fk_contacts_user
    --   FOREIGN KEY (user_id)
    --   REFERENCES users (id)
    --   ON DELETE CASCADE
    --   ON UPDATE CASCADE,
    UNIQUE KEY unique_user_contact_email (user_id, email) -- Опционально, если email должен быть уникальным для каждого пользователя
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
