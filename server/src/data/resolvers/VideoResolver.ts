import { Arg, Args, ArgsType, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-koa";
import { Inject } from "typedi";
import { getVideoID } from "ytdl-core";
import { PaginationArgs } from "../utils/PaginationArgs";
import { SortOrder } from "../enums/SortOrder";
import { EmptyResponse } from "../objectTypes/EmptyResponse";
import { Video } from "../models/Video";
import { VideoController } from "../../controllers/VideoController";
import { PaginatedVideoResponse } from "../objectTypes/PaginatedVideoResponse";

@ArgsType()
export class GetVideoArgs extends PaginationArgs {
  @Field(() => Boolean, { defaultValue: true })
  onlyPublished: boolean;

  @Field(() => SortOrder, { defaultValue: SortOrder.DESCENDING })
  order: SortOrder;
}

@InputType()
class UpdateVideoInput {
  @Field(() => String, { nullable: true }) title?: string | null;

  @Field(() => Date, { nullable: true }) publicationDate?: Date | null;
}

@Resolver(() => Video)
export class VideoResolver {
  @InjectRepository(Video) private readonly videoRepository: Repository<Video>;

  @Inject(() => VideoController) private readonly videoController: VideoController;

  @Query(() => PaginatedVideoResponse)
  async videos(@Args() args: GetVideoArgs): Promise<PaginatedVideoResponse> {
    const { hasMore, videos } = await this.videoController.getVideos({
      skip: args.skip,
      take: args.take ?? undefined,
      onlyPublished: args.onlyPublished,
      order: args.order
    });

    return {
      hasMore,
      items: videos
    };
  }

  @Query(() => Video, { nullable: true })
  video(@Arg("id", () => ID) id: string) {
    return this.videoRepository.findOne(id);
  }

  @Mutation(() => Video, { nullable: true })
  async createVideo(@Arg("videoIDOrURL") videoIDOrURL: string): Promise<Video | null> {
    let title;
    let videoID;

    try {
      videoID = getVideoID(videoIDOrURL);
      title = await VideoController.getVideoTitle(videoID);
    } catch {
      return null;
    }

    const existingVideo = await this.videoRepository.findOne({ videoID });

    if (existingVideo !== undefined) {
      return existingVideo;
    }

    const video = new Video();
    video.videoID = videoID;
    video.title = title;

    await this.videoRepository.save(video);
    return video;
  }

  @Mutation(() => Video)
  async updateVideo(@Arg("id", () => ID) id: string, @Arg("video") data: UpdateVideoInput): Promise<Video> {
    const video = await this.videoRepository.findOne(id);

    if (video === undefined) {
      throw new ApolloError("There is no video with the specified ID.");
    }

    return this.applyDataToVideoAndSave(video, data);
  }

  @Mutation(() => EmptyResponse)
  async deleteVideo(@Arg("id", () => ID) id: string) {
    const video = await this.videoRepository.findOne(id);

    if (video === undefined) {
      throw new ApolloError("There is no video with the specified ID.");
    }

    await this.videoRepository.remove(video);
    return new EmptyResponse();
  }

  private async applyDataToVideoAndSave(video: Video, data: UpdateVideoInput) {
    video.title = data.title ?? video.title;
    video.publicationDate = data.publicationDate === undefined ? video.publicationDate : data.publicationDate;

    return this.videoRepository.save(video);
  }
}
