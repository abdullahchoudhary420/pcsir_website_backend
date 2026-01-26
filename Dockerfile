# Use the official Node.js image as the base image
FROM node:20 AS builder

# Set the working directory inside the container
WORKDIR /app

# Install required tools for SSH
RUN apt-get update && apt-get install -y openssh-client git && rm -rf /var/lib/apt/lists/*

# Prepare the SSH directory and add known hosts
RUN mkdir -p /root/.ssh
RUN ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN --mount=type=ssh npm install --legacy-peer-deps 

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Set the command to run your application
CMD ["npm", "start"]

