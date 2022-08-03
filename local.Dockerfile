FROM node:16.16.0-alpine3.15

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --pure-lockfile

COPY . .

CMD [ "yarn", "dev" ]