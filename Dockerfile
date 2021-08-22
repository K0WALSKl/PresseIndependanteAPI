FROM node:latest
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app
RUN npm install --production
copy ./ /usr/src/app
ENTRYPOINT ["node", "./bin/www"]