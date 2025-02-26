# Stage 1: Build the application using Node.js (use Node 18 for full Web Crypto support)
FROM node:18 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the application using Vite; by default, Vite outputs to the 'dist' folder
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the builder stage to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx in the foreground so the container remains running
CMD ["nginx", "-g", "daemon off;"]
