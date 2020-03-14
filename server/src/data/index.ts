import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-koa";
import { Container } from "typedi";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";

// TODO: Use Query complexity https://typegraphql.com/docs/complexity.html

export async function initApollo() {
  const schema = await buildSchema({
    resolvers: [PostResolver, UserResolver],
    container: Container,
    validate: false
  });

  return new ApolloServer({
    schema,
    subscriptions: {
      path: "/graphql"
    }
  });
}
