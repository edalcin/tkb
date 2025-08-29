# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install any needed packages
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Set environment variable to accept connections from any host
ENV HOST=0.0.0.0

# Run the app when the container launches
CMD ["pnpm", "start"]
