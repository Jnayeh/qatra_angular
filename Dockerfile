FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN echo "BASE_URL=https://qatra-api.zayenha.app" > .env \
 && echo "WS_BASE_URL=wss://qatra-ws.zayenha.app/ws/notifications" >> .env \
 && npm run build:prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
