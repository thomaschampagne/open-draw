#!/bin/bash

# Build the Docker image
docker build -f ./integrate.Dockerfile -t integrate-open-draw:latest .
if [ $? -ne 0 ]; then
    echo "Error: Failed to build the Docker image."
    exit 1
fi

# Run the container
docker run -it --rm \
  -v "$(pwd)":/app \
  -p 4173:4173 \
  -p 5173:5173 \
  integrate-open-draw:latest sh -c "rm -rf ./.pnpm-store ./node_modules ./dist && pnpm run integrate && pnpm run preview"

# Ask if the image should be removed
echo -n "Did the test run successfully? (y/n): "
read response

if [[ "$response" =~ ^[Yy]$ ]]; then
    docker rmi integrate-open-draw:latest
    echo "Image removed."
else
    echo "Image kept."
fi
