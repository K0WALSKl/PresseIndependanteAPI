FROM node:latest
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ../package.json /usr/src/app
RUN npm install --production
COPY .. .
CMD [ "npm", "start" ]