# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

# Start the Expo server using the new local Expo CLI
CMD ["npx", "expo", "start", "--tunnel" , "--port","8083"]