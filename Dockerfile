# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Produção
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3001

CMD ["npm", "start"]