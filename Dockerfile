FROM node:12.18.3-alpine3.12

COPY . /app

WORKDIR /app
RUN yarn
RUN yarn build

EXPOSE 3000
ENTRYPOINT ["yarn", "start"]
