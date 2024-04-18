FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# update packages
RUN apk update

# # create root application folder
# WORKDIR /variamos

# copy configs to /variamos folder
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

# copy source code to /variamos/src folder
COPY ./ . 
COPY .env ./