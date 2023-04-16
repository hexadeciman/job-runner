FROM node:alpine

WORKDIR /usr/src/app

RUN apk --no-cache add curl
RUN apk add --no-cache bash

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . ./
RUN npm run build
EXPOSE 8000
CMD ["npm", "run", "start"]
