# Stage 1: Build Stage
FROM node:14-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies, including dev dependencies for testing
RUN npm install

# Copy the rest of the application
COPY . .

# Run tests
RUN npm test

# Stage 2: Production Stage (final image)
FROM node:14-alpine

# Set working directory for the final image
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage (excluding test files and dev dependencies)
COPY --from=build /usr/src/app /usr/src/app

# Remove any unnecessary files like test files if they are not needed in production
RUN rm -rf test node_modules/*

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "server.js"]
