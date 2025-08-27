# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Stage 3: Final Image
FROM node:18-alpine

# Install dependencies: Supervisor for process management and IPFS
RUN apk add --no-cache supervisor python3 build-base wget tar gzip

# Install IPFS (Kubo) - detect architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; elif [ "$ARCH" = "aarch64" ]; then ARCH="arm64"; fi && \
    wget https://dist.ipfs.tech/kubo/v0.21.0/kubo_v0.21.0_linux-${ARCH}.tar.gz \
    && tar -xzf kubo_v0.21.0_linux-${ARCH}.tar.gz \
    && mv kubo/ipfs /usr/local/bin/ \
    && chmod +x /usr/local/bin/ipfs \
    && rm -rf kubo kubo_v0.21.0_linux-${ARCH}.tar.gz

# Set up application directory
WORKDIR /app

# Copy built frontend and backend from builder stages
COPY --from=frontend-builder /app/frontend/build ./frontend-build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY backend/package*.json ./backend/
RUN npm install --prefix ./backend --only=production

# Copy blockchain component
COPY blockchain ./blockchain
RUN npm install --prefix ./blockchain

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create directory for IPFS data, application data and Supervisor logs
RUN mkdir -p /data/ipfs /app/data /var/log/supervisor
ENV IPFS_PATH=/data/ipfs

# IPFS will be initialized at runtime

# Expose the backend port
EXPOSE 3001

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
