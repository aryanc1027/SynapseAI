FROM node:20-slim as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Development command (React dev server with hot reload)
CMD ["npm", "start"]
