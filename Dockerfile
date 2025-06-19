
# 1. Этап сборки (Build Stage)
FROM node:18-alpine AS builder

# Установка pnpm (если используется, иначе можно пропустить или заменить на yarn/npm)
# RUN npm install -g pnpm

WORKDIR /app

# Копирование файлов package.json и lock-файла (pnpm-lock.yaml, package-lock.json, yarn.lock)
COPY package.json ./
# COPY pnpm-lock.yaml ./ # Если используется pnpm
COPY package-lock.json ./ # Если используется npm
# COPY yarn.lock ./ # Если используется yarn

# Установка зависимостей
RUN npm install --frozen-lockfile # или pnpm install --frozen-lockfile или yarn install --frozen-lockfile

# Копирование остальных файлов проекта
COPY . .

# Сборка приложения Next.js
# Переменные окружения для сборки (например, NEXT_PUBLIC_FIREBASE_API_KEY)
# должны быть доступны на этом этапе, если они используются в коде во время сборки.
# Их можно передать через --build-arg в команде docker build или если они есть в .env файле, который копируется.
# Однако, для публичных переменных (NEXT_PUBLIC_*) они должны быть доступны во время выполнения,
# поэтому их часто устанавливают при запуске контейнера.
# Для переменных, нужных ТОЛЬКО на этапе сборки, можно использовать ARG.
# ARG NEXT_PUBLIC_FIREBASE_API_KEY
# ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
# ... и так далее для других NEXT_PUBLIC_* переменных, если они нужны именно при сборке.

RUN npm run build

# 2. Этап выполнения (Production Stage)
FROM node:18-alpine

WORKDIR /app

# Копирование собранного приложения из этапа сборки
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public # Если есть папка public

# Установка переменных окружения для выполнения.
# Эти переменные будут использоваться при запуске приложения.
# Их значения следует передавать при запуске контейнера (docker run -e ...).
# Здесь можно указать значения по умолчанию, если это безопасно, или оставить их пустыми.
# ENV NODE_ENV production
# ENV PORT 3000
# ENV DB_HOST=db_host_example
# ... и другие переменные из .env.production

# Открытие порта, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложения
# Используем "next start" напрямую, так как PM2 в Docker обычно избыточен (Docker сам управляет процессом).
# Если нужен легковесный запуск без полного сервера Node.js, можно использовать `node server.js` после `npx next-server`.
CMD ["npm", "run", "start"]

# Для более легковесного образа можно использовать multi-stage build
# и копировать только необходимые артефакты.
# Также можно рассмотреть использование `node:18-alpine` для уменьшения размера образа.

# Важно: Файл .env.production не должен копироваться в образ Docker.
# Переменные окружения передаются в контейнер при его запуске.
# Убедитесь, что .dockerignore настроен правильно, чтобы исключить node_modules, .next и т.д. из контекста сборки (если они не нужны).
# В данном Dockerfile node_modules копируются с этапа сборки, что является стандартной практикой.
