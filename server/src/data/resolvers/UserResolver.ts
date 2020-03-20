import {
  Arg, Ctx, Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType, Query,
  Resolver,
  ResolverInterface,
  Root
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-koa";
import { User } from "../models/User";
import { EmptyResponse } from "../objectTypes/EmptyResponse";
import { Context } from "../Context";
import * as bcrypt from "bcrypt";
import nanoid from "nanoid/async";

@ObjectType()
export class TokenResponse {
  constructor(token: string) {
    this.token = token;
  }

  @Field(() => String)
  token: string;
}

const createInvalidIDError = () => new ApolloError("There is no user with the specified id.", "INVALID_ID");

@Resolver(() => User)
export class UserResolver implements ResolverInterface<User> {
  @InjectRepository(User) private readonly userRepository: Repository<User>;

  @FieldResolver()
  async role(@Root() user: User) {
    return (await this.userRepository.findOne(user.id, { select: ["id"], relations: ["role"] }))!.role;
  }

  @FieldResolver()
  async displayName(@Root() user: User) {
    return user.getDisplayName();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("username") username: string) {
    return ((await this.userRepository.findOne({ username })) ?? null);
  }

  @Query(() => User)
  async me(@Ctx() context: Context) {
    return context.user;
  }

  @Mutation(() => TokenResponse)
  async getOrCreateAuthenticationToken(@Arg("id", () => ID) id: string, @Arg("password") password: string) {
    const user = await this.userRepository.findOne(id);

    if (user === undefined) {
      throw createInvalidIDError();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new ApolloError("The specified password is wrong.", "INVALID_PASSWORD");
    }

    if (user.token === null) {
      user.token = await nanoid(50);
      await this.userRepository.save(user);
    }

    return new TokenResponse(user.token);
  }

  @Mutation(() => EmptyResponse)
  async deleteAuthenticationToken(@Arg("userID", () => ID) userID: string) {
    const user = await this.userRepository.findOne(userID);

    if (user === undefined) {
      throw createInvalidIDError();
    }

    user.token = null;
    await this.userRepository.save(user);

    return new EmptyResponse();
  }

  @Mutation(() => TokenResponse)
  async regenerateAuthenticationToken(@Ctx() context: Context) {
    context.user.token = await nanoid(50);
    await this.userRepository.save(context.user);

    return new TokenResponse(context.user.token);
  }
}
