
FROM node:22-alpine AS builder

WORKDIR /app


COPY package*.json tsconfig*.json ./


RUN npm ci


COPY . .


RUN npm run build



FROM node:22-alpine

WORKDIR /app


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env


RUN npm ci

EXPOSE 3000

CMD ["npm", "start"]
