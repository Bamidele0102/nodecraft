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

# Ensure test files are copied
COPY tests ./tests

# Run tests (the build will fail if tests do not pass)
RUN npm run test

# Stage 2: Production Stage (final image)
FROM node:14-alpine

# Set working directory for the final image
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Remove unnecessary files, such as tests and dev dependencies
RUN rm -rf tests && npm prune --production

# Expose the application port
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "server.js"]
