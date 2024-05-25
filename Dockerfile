# Use an official Node.js runtime as the base image
# FROM node:bullseye-slim
# FROM node:slim
FROM node:18.16.0

#Assign Environment varibale to APP_BASE_DIR
ENV APP_BASE_DIR=/opt/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install wget 
RUN apt-get update && apt-get install -y wget

# Install app dependencies
RUN npm install

# Install nodemon globally
# RUN npm install -g nodemon


# install Microsoft SQL Server requirements.
ENV ACCEPT_EULA=Y
RUN apt-get update -y && apt-get update 
RUN apt-get -y install gcc libc-dev g++ libffi-dev libxml2 libssl-dev
RUN apt-get install -y --no-install-recommends wget gcc g++ gnupg 
# unixodbc-dev

# Add SQL Server ODBC Driver 17 for Ubuntu 18.04
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN wget -qO- https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN apt-get update 
RUN apt-get install -y --no-install-recommends --allow-unauthenticated msodbcsql17
RUN apt-get install -y --no-install-recommends --allow-unauthenticated mssql-tools
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile 
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc


# install azure cli
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

#Create the directory
RUN mkdir -p ${APP_BASE_DIR}

# Set the working directory
WORKDIR $APP_BASE_DIR

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 8080

# Define the command to run your app
ENTRYPOINT ["npm", "run", "test"]

