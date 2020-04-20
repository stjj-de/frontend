import {
  Arg,
  Args,
  ArgsType, Ctx,
  Field,
  FieldResolver, ID, InputType, Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-koa";
import { Inject } from "typedi";
import { Post } from "../models/Post";
import { PaginationArgs } from "../utils/PaginationArgs";
import { SortOrder } from "../enums/SortOrder";
import { EmptyResponse } from "../objectTypes/EmptyResponse";
import { AuthenticatedContext } from "../Context";
import { PostSortField } from "../enums/PostSortField";
import { PostController } from "../../controllers/PostController";
import { argsToSortOptions, ISortArgs } from "../../utils/SortOptions";
import { PaginatedPostResponse } from "../objectTypes/PaginatedPostResponse";

@ArgsType()
export class GetPostsArgs extends PaginationArgs implements ISortArgs<PostSortField | null> {
  @Field(() => Boolean, { defaultValue: false })
  onlyRelevant: boolean;

  @Field(() => Boolean, { defaultValue: true })
  onlyPublished: boolean;

  @Field(() => PostSortField, { nullable: true })
  sortBy: PostSortField | null;

  @Field(() => SortOrder, { defaultValue: SortOrder.DESCENDING })
  order: SortOrder;
}

@InputType()
class UpdatePostInput {
  @Field(() => String, { nullable: true }) slug?: string | null;

  @Field(() => String, { nullable: true }) title?: string | null;

  @Field(() => Date, { nullable: true }) publicationDate?: Date | null;

  @Field(() => Date, { nullable: true }) relevantUntil?: Date | null;

  @Field(() => String, { nullable: true }) excerpt?: string | null;

  @Field(() => String, { nullable: true }) content?: string | null;
}

@Resolver(() => Post)
export class PostResolver implements ResolverInterface<Post> {
  @InjectRepository(Post) private readonly postRepository: Repository<Post>;

  @Inject(() => PostController) private readonly postController: PostController;

  @Query(() => PaginatedPostResponse)
  async posts(@Args() args: GetPostsArgs): Promise<PaginatedPostResponse> {
    const { hasMore, posts } = await this.postController.getPosts({
      skip: args.skip,
      take: args.take ?? undefined,
      onlyPublished: args.onlyPublished,
      onlyRelevant: args.onlyRelevant,
      ...argsToSortOptions(args)
    });

    return {
      hasMore,
      items: posts
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => ID) id: string) {
    return this.postRepository.findOne(id);
  }

  @Query(() => Post, { nullable: true })
  postBySlug(@Arg("slug") slug: string) {
    return this.postRepository.findOne({ where: { slug } });
  }

  @Mutation(() => Post)
  async createPost(@Arg("title") title: string, @Arg("slug") slug: string, @Ctx() context: AuthenticatedContext): Promise<Post> {
    const post = new Post();
    post.authors = [context.user];
    post.title = title;
    post.slug = slug;

    await this.postRepository.save(post);

    return post;
  }

  @Mutation(() => Post)
  async updatePost(@Arg("id", () => ID) id: string, @Arg("post") data: UpdatePostInput): Promise<Post> {
    const post = await this.postRepository.findOne(id);

    if (post === undefined) {
      throw new ApolloError("There is no post with the specified ID.");
    }

    return this.applyDataToPostAndSave(post, data);
  }

  @Mutation(() => EmptyResponse)
  async deletePost(@Arg("id", () => ID) id: string) {
    const event = await this.postRepository.findOne(id);

    if (event === undefined) {
      throw new ApolloError("There is no post with the specified ID.");
    }

    await this.postRepository.remove(event);
    return new EmptyResponse();
  }

  @FieldResolver()
  async authors(@Root() post: Post) {
    return (await this.postRepository.findOne(post.id, { relations: ["authors"] }))!.authors;
  }

  private async applyDataToPostAndSave(post: Post, data: UpdatePostInput) {
    post.title = data.title ?? post.title;
    post.slug = data.slug ?? post.slug;
    post.excerpt = data.excerpt ?? post.excerpt;
    post.publicationDate = data.publicationDate === undefined ? post.publicationDate : data.publicationDate;
    post.relevantUntil = data.relevantUntil === undefined ? post.relevantUntil : data.relevantUntil;
    post.content = data.content ?? post.content;

    return this.postRepository.save(post);
  }
}
