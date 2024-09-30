# Stage 1: Build Stage
FROM node:16-buster AS build

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ build-essential

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application
COPY . .

# Stage 2: Production Stage (final image)
FROM node:16-alpine

# Set working directory for the final image
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Remove unnecessary files, such as tests and dev dependencies
RUN rm -rf tests && npm prune --production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
