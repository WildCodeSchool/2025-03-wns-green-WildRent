FROM node:lts-alpine
WORKDIR /app

RUN apk --no-cache add curl
COPY package*.json ./
COPY tsconfig.json ./
RUN npm i

COPY src src

CMD npm start