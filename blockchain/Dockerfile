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

# Give execution permission to the entrypoint script
RUN chmod +x /app/entrypoint.sh

# Run the entrypoint script when the container launches
CMD ["/app/entrypoint.sh"]
