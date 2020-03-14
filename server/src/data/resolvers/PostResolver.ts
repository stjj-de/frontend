import { Arg, Args, ArgsType, Field, FieldResolver, Int, Query, Resolver, ResolverInterface, Root } from "type-graphql";
import { getConnection, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "../models/Post";
import { PaginationArgs } from "../utils/PaginationArgs";

@ArgsType()
export class GetPostsArgs extends PaginationArgs {
  @Field(() => Boolean, { defaultValue: false })
  onlyRelevant: boolean;
}

@Resolver(() => Post)
export class PostResolver implements ResolverInterface<Post> {
  @InjectRepository(Post) private readonly postRepository: Repository<Post>;

  @Query(() => [Post], { nullable: true })
  posts(@Args() { onlyRelevant, skip, take }: GetPostsArgs) {
    const where = onlyRelevant ? `${"`Post`.`relevantUntil`"} > '${new Date().toISOString()}'` : "";

    return getConnection().getRepository(Post)
      .find({ where, skip, take });
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number) {
    return getConnection().getRepository(Post)
      .findOne({ where: { id } });
  }

  @Query(() => Post, { nullable: true })
  postBySlug(@Arg("slug") slug: string) {
    return getConnection().getRepository(Post)
      .findOne({ where: { slug } });
  }

  @FieldResolver()
  async authors(@Root() post: Post) {
    return (await this.postRepository.findOne(post.id, { relations: ["authors"] }))!.authors;
  }
}
