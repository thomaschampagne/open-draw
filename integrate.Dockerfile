FROM node:lts-alpine

RUN npm install -g npm@latest && \
    npm install -g pnpm@latest

# Set the working directory
WORKDIR /app

USER node

# Expose the port your application runs on
EXPOSE 4173
EXPOSE 5173
