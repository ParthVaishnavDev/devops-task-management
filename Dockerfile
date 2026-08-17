# Stage 1: Build dependencies
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Production image
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

EXPOSE 5000
CMD ["node", "server.js"]
