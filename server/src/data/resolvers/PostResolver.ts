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
import { FindManyOptions, FindOneOptions, Raw, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "../models/Post";
import { PaginationArgs } from "../utils/PaginationArgs";
import { SortOrder } from "../enums/SortOrder";

enum PostSortField {
  PUBLICATION_DATE = "publicationDate"
}

registerEnumType(PostSortField, {
  name: "PostSortField",
  description: "The field by which the data will be sorted."
});

@ArgsType()
export class GetPostsArgs extends PaginationArgs {
  @Field(() => Boolean, { defaultValue: false })
  onlyRelevant: boolean;

  @Field(() => Boolean, { defaultValue: true })
  onlyPublished: boolean;

  @Field(() => PostSortField, { nullable: true })
  sortBy: PostSortField | null;

  @Field(() => SortOrder, { defaultValue: SortOrder.DESCENDING })
  order: SortOrder;
}

@Resolver(() => Post)
export class PostResolver implements ResolverInterface<Post> {
  @InjectRepository(Post) private readonly postRepository: Repository<Post>;

  @Query(() => [Post], { nullable: true })
  posts(@Args() { skip, take, ...arguments_ }: GetPostsArgs) {
    const where: FindManyOptions<Post>["where"] = {};

    if (arguments_.onlyRelevant) {
      where.relevantUntil = Raw(alias => `${alias} > NOW()`);
    }

    if (arguments_.onlyPublished) {
      where.publicationDate = Raw(alias => `${alias} < NOW()`);
    }

    const order: FindManyOptions<Post>["order"] =
      arguments_.sortBy === PostSortField.PUBLICATION_DATE
        ? { publicationDate: arguments_.order } : undefined;

    return this.postRepository.find({ where, skip, order, take } as FindManyOptions<Post>);
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number) {
    return this.postRepository.findOne({ where: { id } });
  }

  @Query(() => Post, { nullable: true })
  postBySlug(@Arg("slug") slug: string) {
    return this.postRepository.findOne({ where: { slug } });
  }

  @FieldResolver()
  async authors(@Root() post: Post) {
    return (await this.postRepository.findOne(post.id, { relations: ["authors"] }))!.authors;
  }
}
