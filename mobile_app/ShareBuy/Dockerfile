# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install the new Expo CLI
RUN npx expo install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 19000

# Start the Expo server
CMD ["npx", "expo", "start"]