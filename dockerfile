# Use official Node.js 18 base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose the port your app runs on
EXPOSE 3666

# Set environment variables (optional, override with docker run -e or .env)
ENV NODE_ENV=production

# Start the app
CMD ["node", "index.js"]
