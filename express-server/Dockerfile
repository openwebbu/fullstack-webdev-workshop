# Create image based on the official Node 6 image from the dockerhub
FROM node:6

# Create node_modules package in different directory from where we will mount from the host OS. This is a workaround to get nodemon working
COPY package.json /usr/
WORKDIR /usr/
RUN npm install
ENV PATH /usr/node_modules/.bin:$PATH

# Change directory so that our commands run inside this new directory
COPY . /usr/app
WORKDIR /usr/app

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "run", "dev"]