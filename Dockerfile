# Базовый образ
FROM node:latest

# Установка рабочей директории
WORKDIR /__sort__

# Копируем package.json и package-lock.json
COPY package.json .

# Установка зависимостей
RUN npm install 

# Копируем исходный код
COPY . .

# Открываем порт (например, для веб-приложения)
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]


