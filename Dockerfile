# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of your application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port (default NestJS port is 3000)
EXPOSE 3035

# Command to run your application
CMD ["node", "dist/main"]
