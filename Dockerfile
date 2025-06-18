# Dockerfile

# 1. Этап сборки (Build Stage)
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальной части кода приложения
COPY . .

# Сборка приложения Next.js
# Здесь могут быть ваши переменные окружения для сборки, если они нужны на этом этапе
# ARG NEXT_PUBLIC_FIREBASE_API_KEY
# ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
# ... и так далее для других NEXT_PUBLIC_ переменных
RUN npm run build

# 2. Этап выполнения (Production Stage)
FROM node:18-alpine

WORKDIR /app

# Установка переменных окружения для продакшена
ENV NODE_ENV production
# ENV PORT 3000 # Next.js по умолчанию использует порт 3000

# Копирование собранного приложения из этапа сборки
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# Копируем node_modules, чтобы не переустанавливать их, если они не изменились.
# Это требует, чтобы зависимости production не отличались сильно от dev.
# Для более чистого подхода можно установить только production зависимости здесь.
COPY --from=builder /app/node_modules ./node_modules


# Открытие порта, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "run", "start"]

# Замечания:
# 1. Этот Dockerfile предполагает, что ваше приложение Next.js может быть запущено с `npm run start`.
# 2. Переменные окружения, необходимые во время выполнения (например, для подключения к БД, ключи API),
#    обычно передаются в контейнер при его запуске (например, через -e флаг или docker-compose.yml),
#    а не встраиваются непосредственно в образ (кроме тех, что нужны для сборки и являются публичными).
#    Файл .env.production НЕ должен копироваться в образ.
# 3. Для оптимизации размера образа можно использовать multi-stage builds более агрессивно,
#    например, устанавливая только `--production` зависимости на финальном этапе.
# 4. Убедитесь, что ваш .dockerignore файл настроен правильно, чтобы исключить ненужные файлы и папки (например, .git, node_modules на хосте).
