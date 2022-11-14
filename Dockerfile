# Docker file for Fragments back-end 

# Stage Dependencies
# Node version might be changed and it needs to be updated here
FROM node:16.15.1-bullseye@sha256:294ed7085d137d4f16fd97c0e1518f1d0386dd7fda7c4897d82c7ba65e15fdd6 AS dependencies




# We default to use port 8080 in our service 
ENV PORT=8080 \
    NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./ 

# Install node dependencies defined in package-lock.json
RUN npm install


# Metadta using LABLE "key=value" pairs for our image
LABEL miantainer="Khashayar Faeghi <kfaeghi@myseneca.ca>" 
LABEL description="Fragments node.js microservice"

#################################################################################################

# Stage Building
FROM node:16.15.1-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS build

WORKDIR /app 

# Copy the granted dependencies (node_modules)
COPY --from=dependencies /app /app

# Copy our source code
COPY . .

# Update apk then add curl 
RUN apk update && \ 
apk --no-cache add curl=7.83.1-r4

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

# Run a health check (Keep updating the AWS EC2 link everytime)
HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail ec2-44-204-20-219.compute-1.amazonaws.com:8080 || exit 1