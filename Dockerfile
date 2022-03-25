# Base image
FROM node:16.14-alpine

# Install dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

# Copy all files to container
COPY . .

# Build for production
RUN yarn build

# Start container
CMD ["yarn", "start"]