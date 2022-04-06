# specify a base image
FROM node:16-alpine
# copy the file into this directory
WORKDIR /app
# copy everthing from the current workdir to the temp container
COPY . .
# install some dependencies
RUN yarn
# to compli
RUN yarn tsc
EXPOSE 3000
# default command
CMD ["node", "bin/www"]

# start up a show "docker ps"
