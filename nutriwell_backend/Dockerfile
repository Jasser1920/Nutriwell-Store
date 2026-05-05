FROM node:18-alpine AS builder
WORKDIR /app

# Install deps and build
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --production=false

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:18-alpine
WORKDIR /app

# Install only production deps
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --omit=dev

# Copy built app
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]
