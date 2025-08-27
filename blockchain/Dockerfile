# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Give execution permission to the entrypoint script
RUN chmod +x /app/entrypoint.sh

# Run the entrypoint script when the container launches
CMD ["/app/entrypoint.sh"]
