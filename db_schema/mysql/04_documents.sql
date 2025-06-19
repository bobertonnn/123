
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(255) NOT NULL, -- Может быть UUID, генерируемый приложением
    user_id VARCHAR(255) NOT NULL, -- Firebase UID владельца/загрузившего документ
    name VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'Signed', 'Completed', 'Rejected', 'Uploaded') NOT NULL DEFAULT 'Uploaded',
    participants JSON DEFAULT NULL, -- JSON массив строк (имена или email участников)
    last_modified DATE DEFAULT NULL, -- Или TIMESTAMP, если нужна точность до времени
    data_url LONGTEXT DEFAULT NULL, -- Для хранения base64 PDF. Внимание: не рекомендуется для больших файлов. Рассмотрите файловое хранилище.
    thumbnail_url VARCHAR(2048) DEFAULT NULL, -- URL к превью
    stamped_signature_url VARCHAR(2048) DEFAULT NULL, -- URL к подписи с печатью (если применимо)
    summary TEXT DEFAULT NULL, -- AI-сгенерированное описание
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    -- INDEX fk_documents_user_idx (user_id ASC),
    -- CONSTRAINT fk_documents_user
    --   FOREIGN KEY (user_id)
    --   REFERENCES users (id) -- Если у вас есть таблица users
    --   ON DELETE CASCADE
    --   ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Примечание по `participants`:
-- Хранение списка участников как JSON удобно, но затрудняет поиск или запросы по конкретным участникам.
-- Для более сложных сценариев можно рассмотреть отдельную таблицу `document_participants` (многие-ко-многим).

-- Примечание по `data_url`:
-- Хранение base64 PDF в `LONGTEXT` может привести к проблемам с производительностью и размером базы данных.
-- Рекомендуется хранить файлы в специализированном файловом хранилище (например, Firebase Storage, AWS S3,
-- или на файловой системе сервера) и сохранять в базе данных только путь или URL к файлу.
-- Текущая реализация с `localStorage` использует data URI, поэтому `LONGTEXT` - это прямой перенос этой логики.
