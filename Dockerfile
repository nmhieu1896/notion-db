# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files except node_modules (this will respect the .dockerignore file)
COPY . .

# Build the application
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
