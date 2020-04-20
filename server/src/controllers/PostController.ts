import { InjectRepository } from "typeorm-typedi-extensions";
import { FindManyOptions, Raw, Repository } from "typeorm";
import { SortOptions } from "../utils/SortOptions";
import { Post } from "../data/models/Post";
import { PostSortField } from "../data/enums/PostSortField";

export interface GetEventsOptions {
  skip?: number;
  take?: number;
  sort?: SortOptions<PostSortField>;
  onlyRelevant?: boolean;
  onlyPublished?: boolean;
}

export class PostController {
  @InjectRepository(Post) private readonly postRepository: Repository<Post>;

  async getPosts(options: GetEventsOptions) {
    const order: FindManyOptions<Post>["order"] = {};

    if (options.sort) {
      // @ts-ignore
      order[options.sort.by] = options.sort.order;
    }

    const where: FindManyOptions<Post>["where"] = {};

    if (options.onlyRelevant) {
      where.relevantUntil = Raw(alias => `${alias} IS NULL OR ${alias} > NOW()`);
    }

    if (options.onlyPublished) {
      where.publicationDate = Raw(alias => `${alias} <= NOW()`);
    }

    const posts = await this.postRepository.find({
      skip: options.skip,
      take: options.take === undefined ? undefined : options.take + 1,
      where,
      order
    });

    const hasMore = options.take === undefined ? false : posts.length === options.take + 1;

    return {
      posts: hasMore ? posts.slice(0, -1) : posts,
      hasMore
    };
  }
}
