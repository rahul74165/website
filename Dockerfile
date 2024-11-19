FROM node:19-alpine3.15 as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:19-alpine3.15

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built frontend and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js .

# Expose port (configurable via environment variable)
EXPOSE ${PORT:-3000}

# Start the server
CMD ["npm", "start"]
