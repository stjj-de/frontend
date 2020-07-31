FROM node:12.18.3-alpine3.12

COPY ./assets /app/assets
COPY ./components /app/components
COPY ./layouts /app/layouts
COPY ./middleware /app/middleware
COPY ./pages /app/pages
COPY ./plugins /app/plugins
COPY ./static /app/static
COPY ./store /app/store
COPY ./LICENSE /app/LICENSE
COPY ./nuxt.config.js /app/nuxt.config.js
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app
RUN yarn
RUN yarn build

EXPOSE 3000
ENTRYPOINT ["yarn", "start"]
