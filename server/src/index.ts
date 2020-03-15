import "dotenv/config";
import "reflect-metadata";
import Koa from "koa"; // eslint-disable-line import/order
import * as http from "http";
import { Container } from "typedi";
import { createConnection, useContainer as useContainerForTypeORM } from "typeorm";
import consola from "consola";
// @ts-ignore
import { Builder, Nuxt } from "nuxt";
import { ApolloServer } from "apollo-server-koa";
import { initApollo } from "./data";
import { createSampleData } from "./data/createSampleData";

process.env.IS_SERVER_RUN = "true";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require("../../nuxt.config.js");

const host = process.env.HOST;
const port = process.env.PORT as unknown as number;

async function initNuxt() {
  config.dev = process.env.NODE_ENV === "development";

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  await nuxt.ready();
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    builder.build(); // is a promise
  }

  return nuxt;
}

async function initORM() {
  useContainerForTypeORM(Container);

  // console.log(await getConnectionOptions());
  await createConnection();

  if (process.env.NODE_ENV === "development") {
    // await createSampleData();
  }
}

async function initKoa(options: { nuxt: any; apollo: ApolloServer; }) {
  const koa = new Koa();

  options.apollo.applyMiddleware({ app: koa, path: "/graphql" });

  koa.use(context => {
    context.status = 200;
    context.respond = false; // Bypass Koa's built-in response handling
    // @ts-ignore
    context.req.ctx = context; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    options.nuxt.render(context.req, context.res);
  });

  return koa;
}

async function initHTTPServer(options: { koa: Koa; apollo: ApolloServer; }) {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const server = http.createServer(options.koa.callback());

  options.apollo.installSubscriptionHandlers(server);

  server.listen(port, host);

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

async function start() {
  if (!host || !port) {
    throw new Error("Please specify HOST and PORT environment variables!");
  }

  const ormPromise = initORM();
  const [nuxt, apollo] = await Promise.all([initNuxt(), initApollo()]);
  const koa = await initKoa({ nuxt, apollo });
  await ormPromise;
  await initHTTPServer({ koa, apollo });
}

start();
