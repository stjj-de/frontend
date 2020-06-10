import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Content } from "../models/Content";

@Resolver()
export class ContentResolver {
  @InjectRepository(Content) private readonly contentRepository: Repository<Content>;

  @Query(() => Content, { nullable: true })
  content(@Arg("id", () => String) id: string) {
    return this.contentRepository.findOne(id);
  }

  @Authorized()
  @Mutation(() => Content)
  async setContent(@Arg("id", () => String) id: string, @Arg("content", () => String) data: string): Promise<Content> {
    let content = await this.contentRepository.findOne(id);

    if (content === undefined) {
      content = this.contentRepository.create();
      content.id = id;
    }

    content.content = data;
    return this.contentRepository.save(content);
  }
}
