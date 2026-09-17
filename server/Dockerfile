FROM node:22-slim

WORKDIR /app

# Install openssl for Prisma binary engines (with Check-Date=false to prevent clock skew issues)
RUN apt-get update -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package manifests and Prisma schemas
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --omit=dev

# Generate Prisma Client for PostgreSQL
RUN npx prisma generate --schema=prisma/schema.postgresql.prisma

# Copy application source code
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

CMD ["node", "server.js"]
