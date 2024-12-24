FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install the Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

# Expose port 4200 for the web server
EXPOSE 4200

# Run the Angular app using 'ng serve'
CMD ["ng", "serve", "--host", "0.0.0.0"]
