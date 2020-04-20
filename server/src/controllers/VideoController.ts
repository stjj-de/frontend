import { InjectRepository } from "typeorm-typedi-extensions";
import { FindManyOptions, Raw, Repository } from "typeorm";
import { getBasicInfo, getURLVideoID } from "ytdl-core";
import { Video } from "../data/models/Video";
import { SortOrder } from "../data/enums/SortOrder";

export interface GetVideosOptions {
  skip?: number;
  take?: number;
  onlyPublished?: boolean;
  order: SortOrder;
}

export class VideoController {
  @InjectRepository(Video) private readonly videoRepository: Repository<Video>;

  static async getVideoTitle(videoID: string) {
    const info = await getBasicInfo(videoID);

    return info.title;
  }

  async getVideos(options: GetVideosOptions) {
    const where: FindManyOptions<Video>["where"] = {};

    if (options.onlyPublished) {
      where.publicationDate = Raw(alias => `${alias} <= NOW()`);
    }

    const videos = await this.videoRepository.find({
      skip: options.skip,
      take: options.take === undefined ? undefined : options.take + 1,
      where,
      order: { publicationDate: options.order }
    });

    const hasMore = options.take === undefined ? false : videos.length === options.take + 1;

    return {
      videos: hasMore ? videos.slice(0, -1) : videos,
      hasMore
    };
  }
}
