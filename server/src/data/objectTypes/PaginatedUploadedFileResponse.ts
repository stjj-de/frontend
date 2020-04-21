import { ObjectType } from "type-graphql";
import { UploadedFile } from "../models/UploadedFile";
import { PaginatedResponse } from "./PaginatedResponse";

@ObjectType()
export class PaginatedUploadedFileResponse extends PaginatedResponse(UploadedFile) {

}
