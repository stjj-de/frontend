import { ApolloError } from "apollo-server-koa";
import { Context } from "../Context";

export function assertAuthentication(context: Context) {
  if (context.user === null) {
    throw new ApolloError("You have to be logged in.");
  }
}
