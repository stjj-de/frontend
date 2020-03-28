import { ApolloError } from "apollo-server-koa";
import { Context } from "../Context";
import { User } from "../models/User";

export function getSafeUser(context: Context): User {
  if (context.user === null) {
    throw new ApolloError("You have to be logged in.");
  }

  return context.user;
}
