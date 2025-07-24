# Use official Node.js image as base
FROM node:22-alpine

# Install Elasticsearch dependencies
RUN apk add --no-cache curl bash

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose application port
EXPOSE 3000

# Health check for Elasticsearch
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://elasticsearch:9200 || exit 1

# Command to run the application
CMD ["npm", "dev"]

