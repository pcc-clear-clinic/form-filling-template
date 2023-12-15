# Use the Node.js base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Transpile TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Command to run the server
CMD ["node", "./dist/index.js"]