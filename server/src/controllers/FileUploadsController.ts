import path from "path";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FindManyOptions, Repository } from "typeorm";
import * as fileType from "file-type";
import { ApolloError } from "apollo-server-koa";
import { SortOptions } from "../utils/SortOptions";
import { UploadedFile } from "../data/models/UploadedFile";
import { UploadedFileSortField } from "../data/enums/UploadedFileSortField";
import { uploadsDirectory } from "../utils/directories";
import * as fs from "fs-extra";
import { FileUpload } from "graphql-upload";
import nanoid from "nanoid/async";
import { unlink } from "fs-extra";

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

    try {
      await (new Promise((resolve, reject) => {
        options.file.createReadStream().pipe(stream)
          .on("error", () => reject(new Error("File upload failed.")))
          .on("finish", () => resolve());
      }));
    } catch {
      stream.destroy();
      await fs.unlink(filePath);
    }

    const uploadedFile = new UploadedFile();
    uploadedFile.mimeType = (await fileType.fromFile(filePath))?.mime ?? null;
    uploadedFile.id = id;
    uploadedFile.alias = options.alias;

    const titleParts = options.title.split(".");
    if (titleParts.length === 1) {
      uploadedFile.title = options.title;
    } else {
      uploadedFile.title = titleParts.slice(0, -1).join(".");
    }

    await this.uploadedFileRepository.save(uploadedFile);
    return uploadedFile;
  }

  async deleteUploadedFile(id: string) {
    const uploadedFile = await this.uploadedFileRepository.findOne(id);

    if (uploadedFile === undefined) {
      throw new ApolloError("There is no uploaded file with the specified ID.");
    }

    await this.uploadedFileRepository.remove(uploadedFile);
    await unlink(path.resolve(uploadsDirectory, id));
  }
}
