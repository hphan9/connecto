# This is a dockerfile for building Docker image of API gateway
# using node base images
# Stage 0: Install aline linux + node +dependencies 

FROM node:18.18.0-alpine3.18@sha256:a315556d82ef54561e54fca7d8ee333382de183d4e56841dcefcd05b55310f46 AS run

WORKDIR /app/gateway

COPY package.json .

RUN npm install
# use port 8000 by default
ENV PORT=8000

#Copy src to /app/src/
COPY . .
RUN true

# Start the container by running our server
CMD [ "npm", "start" ]

# We run our service on port 8000
EXPOSE 8000
