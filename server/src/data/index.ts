import { buildSchema } from "type-graphql";
import { ApolloServer, ApolloError } from "apollo-server-koa";
import { Container } from "typedi";
import { getRepository } from "typeorm";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { EventResolver } from "./resolvers/EventResolver";
import { GottesdienstResolver } from "./resolvers/GottesdienstResolver";
import { VideoResolver } from "./resolvers/VideoResolver";
import { Context } from "./Context";
import { User } from "./models/User";

export async function initApollo() {
  const schema = await buildSchema({
    resolvers: [PostResolver, UserResolver, EventResolver, GottesdienstResolver, VideoResolver],
    container: Container,
    validate: false,
    authChecker: resolverData => {
      // eslint-disable-next-line prefer-destructuring
      const context: Context = resolverData.context;
      return context.user !== null;
    }
  });

  return new ApolloServer({
    schema,
    subscriptions: {
      path: "/graphql"
    },
    async context({ ctx }): Promise<Context> {
      const header = ctx.headers.authorization;

      if (!header) {
        return {
          user: null
        };
      }

      const token = header.slice(7);
      const user = await getRepository(User).findOne({ token });

      if (user === undefined) {
        throw new ApolloError("Invalid authentication token.");
      }

      return {
        user
      };
    }
  });
}
