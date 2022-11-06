# Use node version 16.15.1
FROM node:16.14-alpine

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Install node dependencies defined in package-lock.json
RUN npm install

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# We default to use port 8080 in our service
ENV PORT=8080

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080




LABEL maintainer="Kash Faeghi <kfaeghi@myseneca.ca>"
LABEL description="Fragments node.js microservice"

#########################################################

