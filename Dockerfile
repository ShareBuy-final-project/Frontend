# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Install expo-cli and @expo/ngrok globally
# RUN npm install -g expo-cli @expo/ngrok 


# Expose the ports the app runs on
EXPOSE 8084

# Start the Expo server using the new local Expo CLI
CMD ["npx", "expo", "start", "--port", "8084"]