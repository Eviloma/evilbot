# Use the official Node.js image with the latest LTS version
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY pnpm-lock.yaml .

# Install project dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Command to run the bot
CMD ["pnpm", "start"]