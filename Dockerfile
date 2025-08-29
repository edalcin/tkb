# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ .
RUN pnpm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY backend/ .
RUN pnpm run build

# Stage 3: Final Image
FROM node:18-alpine

# Install pnpm and dependencies: Supervisor for process management and IPFS
RUN corepack enable && corepack prepare pnpm@latest --activate
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
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
RUN cd ./backend && pnpm install --prod --frozen-lockfile

# Copy blockchain component
COPY blockchain ./blockchain
RUN cd ./blockchain && pnpm install --frozen-lockfile

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
