# Use the official Node.js image (lightweight Alpine version for production)
FROM node:19-alpine3.15

# Set the working directory inside the container
WORKDIR /app

# Copy only the package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Expose the port your application runs on (e.g., 3000)
EXPOSE 3000

# Define the command to start the application
CMD ["npm", "start"]
