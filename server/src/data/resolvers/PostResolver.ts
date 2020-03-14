import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Int,
  Query,
  registerEnumType,
  Resolver,
  ResolverInterface,
  Root
} from "type-graphql";
import { FindOneOptions, getConnection, Raw, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "../models/Post";
import { PaginationArgs } from "../utils/PaginationArgs";

enum PostOrder {
  PUBLICATION_DATE = "publication_date"
}

registerEnumType(PostOrder, {
  name: "PostOrder",
  description: "The order in which the posts will be returned."
});

@ArgsType()
export class GetPostsArgs extends PaginationArgs {
  @Field(() => Boolean, { defaultValue: false })
  onlyRelevant: boolean;

  @Field(() => Boolean, { defaultValue: true })
  onlyPublished: boolean;

  @Field(() => PostOrder, { nullable: true })
  orderBy: PostOrder | null;
}

@Resolver(() => Post)
export class PostResolver implements ResolverInterface<Post> {
  @InjectRepository(Post) private readonly postRepository: Repository<Post>;

  @Query(() => [Post], { nullable: true })
  posts(@Args() { skip, take, ...arguments_ }: GetPostsArgs) {
    const where: FindOneOptions<Post>["where"] = {};

    if (arguments_.onlyRelevant) {
      where.relevantUntil = Raw(alias => `${alias} > NOW()`);
    }

    if (arguments_.onlyPublished) {
      where.publicationDate = Raw(alias => `${alias} < NOW()`);
    }

    const orderOption: FindOneOptions<Post>["order"] = arguments_.orderBy === PostOrder.PUBLICATION_DATE
      ? { publicationDate: "DESC" }
      : undefined;

    return getConnection().getRepository(Post)
      .find({ where, skip, take, order: orderOption });
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
