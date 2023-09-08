FROM node:current-alpine

RUN apk add chromium

# skips puppeteer installing chrome and points to correct binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
    
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . ./
RUN npx prisma generate
RUN npm run build
EXPOSE 8000
CMD ["npm", "run", "start"]
