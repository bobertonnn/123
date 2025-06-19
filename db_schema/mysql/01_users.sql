
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) NOT NULL, -- Firebase UID
    full_name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) UNIQUE DEFAULT NULL, -- Может дублировать Firebase Auth email для удобства
    signature_url TEXT DEFAULT NULL, -- URL к изображению подписи (или base64, но хранение файла предпочтительнее)
    user_tag VARCHAR(100) UNIQUE DEFAULT NULL,
    phone_number VARCHAR(50) DEFAULT NULL,
    company_name VARCHAR(255) DEFAULT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Примечание: Эта таблица предназначена для хранения дополнительной информации о профиле пользователя,
-- которая может не храниться напрямую в Firebase Authentication или для более удобного доступа
-- на бэкенде. Аутентификация по-прежнему управляется Firebase.
-- `email` и `full_name` могут быть синхронизированы из Firebase Auth при создании пользователя в этой таблице.
