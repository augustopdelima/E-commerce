FROM node:22-alpine AS builder

WORKDIR /app


COPY package*.json tsconfig*.json ./

RUN mkdir -p /app/uploads /app/data
RUN npm ci


COPY . .


RUN npm run build


FROM node:22-alpine

WORKDIR /app


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/package-lock.json ./

COPY --from=builder /app/dist ./dist


COPY --from=builder /app/.env ./.env


COPY --from=builder /app/seed.js ./seed.js


RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]