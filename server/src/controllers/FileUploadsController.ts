import path from "path";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FindManyOptions, Repository } from "typeorm";
import { SortOptions } from "../utils/SortOptions";
import { UploadedFile } from "../data/models/UploadedFile";
import { UploadedFileSortField } from "../data/enums/UploadedFileSortField";
import { uploadsDirectory } from "../utils/directories";
import * as fs from "fs-extra";
import { FileUpload } from "graphql-upload";
import nanoid from "nanoid/async";

export interface GetUploadedFilesOptions {
  skip?: number;
  take?: number;
  sort?: SortOptions<UploadedFileSortField>;
}

export interface UploadFileOptions {
  title: string;
  alias: string | null;
  file: FileUpload;
}

export class FileUploadsController {
  @InjectRepository(UploadedFile) private readonly uploadedFileRepository: Repository<UploadedFile>;

  async getUploadedFiles(options: GetUploadedFilesOptions) {
    const order: FindManyOptions<UploadedFile>["order"] = {};

    if (options.sort) {
      // @ts-ignore
      order[options.sort.by] = options.sort.order;
    }

    const uploadedFiles = await this.uploadedFileRepository.find({
      skip: options.skip,
      take: options.take === undefined ? undefined : options.take + 1,
      order
    });

    const hasMore = options.take === undefined ? false : uploadedFiles.length === options.take + 1;

    return {
      uploadedFiles: hasMore ? uploadedFiles.slice(0, -1) : uploadedFiles,
      hasMore
    };
  }

  async uploadFile(options: UploadFileOptions): Promise<UploadedFile> {
    const id = await nanoid(10);
    const filePath = path.resolve(uploadsDirectory, id);
    const stream = fs.createWriteStream(filePath);

    await (new Promise((resolve, reject) => {
      options.file.createReadStream().pipe(stream)
        .on("error", async () => {
          stream.destroy();
          await fs.unlink(filePath);

          reject(new Error("File upload failed."));
        })
        .on("finished", () => resolve());
    }));

    const uploadedFile = new UploadedFile();
    uploadedFile.id = id;
    uploadedFile.title = options.title;
    uploadedFile.alias = options.alias;

    await this.uploadedFileRepository.save(uploadedFile);
    return uploadedFile;
  }
}
