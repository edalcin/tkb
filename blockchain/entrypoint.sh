#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Start the Hardhat node in the background
echo "Starting Hardhat node in background..."
npx hardhat node --hostname 0.0.0.0 &

# Capture the process ID of the background node
NODE_PID=$!

# Wait a few seconds for the node to be ready
echo "Waiting for node to initialize..."
sleep 5

# Run the deployment script against the now-running node
echo "Deploying contracts..."
npx hardhat run scripts/deploy.ts --network localhost

echo "Deployment complete. Hardhat node is running."

# Wait for the background node process. This will keep the container running.
# If the node process exits, this script will also exit.
wait $NODE_PID