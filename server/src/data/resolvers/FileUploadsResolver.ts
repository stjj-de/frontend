import { Arg, Args, ArgsType, Authorized, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Not, Repository } from "typeorm";
import { Inject } from "typedi";
import { ApolloError } from "apollo-server-koa";
import { UploadedFile } from "../models/UploadedFile";
import { FileUploadsController } from "../../controllers/FileUploadsController";
import { PaginationArgs } from "../utils/PaginationArgs";
import { argsToSortOptions, ISortArgs } from "../../utils/SortOptions";
import { SortOrder } from "../enums/SortOrder";
import { UploadedFileSortField } from "../enums/UploadedFileSortField";
import { PaginatedUploadedFileResponse } from "../objectTypes/PaginatedUploadedFileResponse";
import { EmptyResponse } from "../objectTypes/EmptyResponse";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@ArgsType()
class GetUploadedFilesArgs extends PaginationArgs implements ISortArgs<UploadedFileSortField | null> {
  @Field(() => SortOrder, { defaultValue: SortOrder.ASCENDING })
  order: SortOrder;

  @Field(() => UploadedFileSortField, { nullable: true, defaultValue: null })
  sortBy: UploadedFileSortField | null;

  @Field(() => String, { nullable: true, description: "Filter by day (yyyy-mm-dd), month (yyyy-mm) or a day span(yyyy-mm-dd:yyyy-mm-dd)." })
  filter: string | null;
}

@ArgsType()
class UploadFileArgs {
  @Field() title: string;

  @Field(() => String, { nullable: true }) alias: string | null;

  @Field(() => GraphQLUpload) file: Promise<FileUpload>;
}

@InputType()
class UpdateUploadedFileInput {
  @Field(() => String, { nullable: true }) title?: string | null;

  @Field(() => String, { nullable: true }) alias?: string | null;
}

@Resolver()
export class FileUploadsResolver {
  @InjectRepository(UploadedFile) uploadedFileRepository: Repository<UploadedFile>;

  @Inject(() => FileUploadsController) private readonly fileUploadsController: FileUploadsController;

  @Authorized()
  @Query(() => PaginatedUploadedFileResponse)
  async uploadedFiles(@Args(() => GetUploadedFilesArgs) args: GetUploadedFilesArgs) {
    const { hasMore, uploadedFiles } = await this.fileUploadsController.getUploadedFiles({
      skip: args.skip,
      take: args.take,
      ...argsToSortOptions(args)
    });

    return {
      items: uploadedFiles,
      hasMore
    };
  }

  @Authorized()
  @Query(() => UploadedFile, { nullable: true })
  uploadedFile(@Arg("id", () => ID) id: string) {
    return this.uploadedFileRepository.findOne(id);
  }

  @Authorized()
  @Query(() => UploadedFile, { nullable: true })
  uploadedFileByAlias(@Arg("alias", () => String) alias: string) {
    return this.uploadedFileRepository.findOne({ alias });
  }

  @Authorized()
  @Mutation(() => UploadedFile)
  async updateUploadedFile(
    @Arg("id", () => ID) id: string, // eslint-disable-line @typescript-eslint/indent
    @Arg("uploadedFile", () => UpdateUploadedFileInput) data: UpdateUploadedFileInput
  ) {
    const uploadedFile = await this.uploadedFileRepository.findOne(id);

    if (uploadedFile === undefined) {
      throw new ApolloError("There is no uploaded file with the specified ID.");
    }

    return this.applyDataToUploadedFileAndSave(uploadedFile, data);
  }

  @Authorized()
  @Mutation(() => EmptyResponse)
  async deleteUploadedFile(@Arg("id", () => ID) id: string) {
    await this.fileUploadsController.deleteUploadedFile(id);
    return new EmptyResponse();
  }

  @Authorized()
  @Mutation(() => UploadedFile)
  async uploadFile(@Args(() => UploadFileArgs) args: UploadFileArgs) {
    return this.fileUploadsController.uploadFile({
      title: args.title,
      alias: args.alias,
      file: await args.file
    });
  }

  async applyDataToUploadedFileAndSave(uploadedFile: UploadedFile, data: UpdateUploadedFileInput) {
    if (data.alias === null) {
      uploadedFile.alias = null;
    } else if (data.alias !== undefined) {
      const existingFileWithAlias = await this.uploadedFileRepository.findOne({ alias: data.alias, id: Not(uploadedFile.id) });

      if (existingFileWithAlias !== undefined) {
        existingFileWithAlias.alias = null;
        await this.uploadedFileRepository.save(existingFileWithAlias);
      }

      uploadedFile.alias = data.alias;
    }

    uploadedFile.title = data.title ?? uploadedFile.title;

    await this.uploadedFileRepository.save(uploadedFile);
    return uploadedFile;
  }
}
