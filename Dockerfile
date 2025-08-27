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

# Install dependencies: Supervisor for process management, wget to download IPFS
RUN apk add --no-cache supervisor python3 build-base libc-utils

# Install glibc for IPFS compatibility
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.39-r0/glibc-2.39-r0.apk -O /tmp/glibc.apk && \
    apk add --no-cache /tmp/glibc.apk && \
    rm /tmp/glibc.apk

# Install IPFS (Kubo)
ENV KUBO_VERSION=v0.23.0
RUN wget https://dist.ipfs.tech/kubo/${KUBO_VERSION}/kubo_${KUBO_VERSION}_linux-amd64.tar.gz -O /tmp/kubo.tar.gz && \
    tar -xvzf /tmp/kubo.tar.gz -C /tmp && \
    mv /tmp/kubo/ipfs /usr/local/bin/ipfs && \
    chmod +x /usr/local/bin/ipfs && \
    rm -rf /tmp/kubo.tar.gz /tmp/kubo

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

# Create directory for IPFS data and Supervisor logs
RUN mkdir -p /data/ipfs /var/log/supervisor
ENV IPFS_PATH=/data/ipfs

# Expose the backend port
EXPOSE 3001

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]