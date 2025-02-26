# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application source code into the container
COPY . .

# Expose the port that your application uses (make sure it matches your .env PORT, e.g., 5001)
EXPOSE 5001

# Command to start the application
CMD ["node", "index.js"]
