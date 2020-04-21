import { Args, ArgsType, Authorized, Field, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Inject } from "typedi";
import { UploadedFile } from "../models/UploadedFile";
import { FileUploadsController } from "../../controllers/FileUploadsController";
import { PaginationArgs } from "../utils/PaginationArgs";
import { argsToSortOptions, ISortArgs } from "../../utils/SortOptions";
import { SortOrder } from "../enums/SortOrder";
import { UploadedFileSortField } from "../enums/UploadedFileSortField";
import { PaginatedUploadedFileResponse } from "../objectTypes/PaginatedUploadedFileResponse";
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

  @Field(() => GraphQLUpload) file: FileUpload;
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

  @Mutation(() => UploadedFile)
  async uploadFile(@Args(() => UploadFileArgs) args: UploadFileArgs) {
    return this.fileUploadsController.uploadFile(args);
  }
}
