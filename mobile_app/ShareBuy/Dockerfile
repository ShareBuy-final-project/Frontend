# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN npm install

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 19000

# Start the Expo server
CMD ["npm", "start"]