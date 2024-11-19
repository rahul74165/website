# Use a compatible Node.js version
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller image for serving the app
FROM node:18-alpine as production

# Set the working directory
WORKDIR /app

# Copy build output from the builder stage
COPY --from=builder /app/dist ./dist

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
