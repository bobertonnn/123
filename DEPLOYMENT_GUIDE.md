# Руководство по развертыванию на выделенном сервере

Это руководство поможет вам развернуть ваше Next.js приложение на выделенном сервере.

## 1. Предварительные требования

Убедитесь, что на вашем сервере установлены:
- **Node.js**: Рекомендуется последняя LTS-версия. Вы можете установить его с помощью `nvm` (Node Version Manager) для удобства управления версиями.
- **npm** (обычно поставляется с Node.js) или **yarn**.

## 2. Подготовка проекта на сервере

1.  **Клонируйте ваш репозиторий** (или скопируйте файлы проекта) на сервер:
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Установите зависимости:**
    ```bash
    npm install
    # или
    # yarn install
    ```

## 3. Переменные окружения

Вашему приложению для корректной работы (например, для Firebase) потребуются переменные окружения.

- Создайте файл `.env.production` в корне вашего проекта на сервере:
  ```bash
  touch .env.production
  ```
- Откройте этот файл в текстовом редакторе и добавьте необходимые переменные. Пример для Firebase (возьмите значения из вашего `.env.local` или из настроек Firebase):
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

  # Любые другие переменные, которые могут понадобиться
  # GENKIT_API_KEY=your_genkit_api_key (если используется)
  ```
- **Важно:** Никогда не добавляйте файл `.env.production` с реальными секретами в систему контроля версий (git). Добавьте `.env.production` в ваш файл `.gitignore`, если его там еще нет.
- Next.js автоматически загрузит переменные из `.env.production` при сборке и запуске в продакшен-режиме.

## 4. Сборка приложения

Соберите ваше приложение для продакшена:
```bash
npm run build
```
Эта команда создаст оптимизированную сборку в папке `.next`.

## 5. Запуск приложения

Для запуска продакшен-сервера используйте:
```bash
npm run start
```
По умолчанию Next.js запустится на порту 3000. Вы можете изменить порт, указав его при запуске: `npm run start -- -p <your_port_number>`.

## 6. Менеджер процессов (PM2)

Чтобы ваше приложение работало в фоновом режиме, автоматически перезапускалось при сбоях и после перезагрузки сервера, рекомендуется использовать менеджер процессов, такой как PM2.

1.  **Установите PM2 глобально (если еще не установлен):**
    ```bash
    npm install pm2 -g
    ```

2.  **Запустите ваше приложение с помощью PM2:**
    ```bash
    pm2 start npm --name "my-nextjs-app" -- run start -- -p 3000
    ```
    (Замените `my-nextjs-app` на имя вашего приложения и `3000` на нужный порт, если он отличается).

3.  **Основные команды PM2:**
    -   `pm2 list`: Показать список всех запущенных приложений.
    -   `pm2 stop <app_name_or_id>`: Остановить приложение.
    -   `pm2 restart <app_name_or_id>`: Перезапустить приложение.
    -   `pm2 logs <app_name_or_id>`: Показать логи приложения.
    -   `pm2 startup`: Настроить PM2 для автоматического запуска ваших приложений при загрузке системы.
    -   `pm2 save`: Сохранить текущий список процессов PM2.

## 7. Обратный прокси (Nginx)

Настоятельно рекомендуется использовать веб-сервер, такой как Nginx, в качестве обратного прокси. Nginx будет принимать HTTP/HTTPS запросы и перенаправлять их на ваше Next.js приложение.

1.  **Установите Nginx:**
    ```bash
    sudo apt update
    sudo apt install nginx
    ```

2.  **Настройте Nginx для вашего сайта.** Создайте новый файл конфигурации для вашего сайта в `/etc/nginx/sites-available/`:
    ```bash
    sudo nano /etc/nginx/sites-available/your-domain.com
    ```
    Пример базовой конфигурации (замените `your-domain.com` на ваш домен и `3000` на порт вашего Next.js приложения):
    ```nginx
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        location / {
            proxy_pass http://localhost:3000; # Порт, на котором запущено ваше Next.js приложение
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Для обслуживания статических файлов Next.js напрямую через Nginx (оптимизация)
        location /_next/static {
            alias /path/to/your-project-directory/.next/static; # Укажите правильный путь
            expires 1y;
            access_log off;
            add_header Cache-Control "public";
        }

        location /static {
            alias /path/to/your-project-directory/public/static; # Укажите правильный путь к папке public/static
            expires 1y;
            access_log off;
            add_header Cache-Control "public";
        }
    }
    ```

3.  **Создайте символическую ссылку на ваш файл конфигурации в `sites-enabled`:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
    ```

4.  **Проверьте конфигурацию Nginx на ошибки:**
    ```bash
    sudo nginx -t
    ```

5.  **Перезапустите Nginx, чтобы применить изменения:**
    ```bash
    sudo systemctl restart nginx
    ```

6.  **Настройка HTTPS (SSL с Let's Encrypt):**
    Рекомендуется использовать Certbot для автоматической настройки SSL.
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```
    Certbot автоматически изменит вашу конфигурацию Nginx для использования HTTPS.

## 8. Брандмауэр

Убедитесь, что ваш брандмауэр (например, `ufw`) настроен на разрешение трафика на порты 80 (HTTP) и 443 (HTTPS).
```bash
sudo ufw allow 'Nginx Full' # или 'Nginx HTTP' и 'Nginx HTTPS' отдельно
sudo ufw enable
sudo ufw status
```

## 9. Обновление приложения

Когда вы вносите изменения в код:
1.  Загрузите изменения на сервер (например, `git pull`).
2.  Установите новые зависимости, если есть (`npm install`).
3.  Пересоберите приложение (`npm run build`).
4.  Перезапустите приложение с помощью PM2 (`pm2 restart my-nextjs-app`).

Это базовое руководство. В зависимости от ваших конкретных потребностей, могут потребоваться дополнительные настройки.
