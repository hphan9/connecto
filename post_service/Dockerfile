# This is a dockerfile for building Docker image of API gateway
# using node base images

FROM node:18.18.0-alpine3.18@sha256:a315556d82ef54561e54fca7d8ee333382de183d4e56841dcefcd05b55310f46 AS run

WORKDIR /app/post_service

COPY package.json .

# use port 8002 by default
ENV PORT=8002

#Copy src to /app/src/
COPY . .
RUN true

# We run our service on port 8002
EXPOSE 8002
# Start the container by running our server
CMD [ "npm", "start" ]


