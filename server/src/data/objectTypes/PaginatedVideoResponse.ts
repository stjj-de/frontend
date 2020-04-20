import { ObjectType } from "type-graphql";
import { PaginatedResponse } from "./PaginatedResponse";
import { Video } from "../models/Video";

@ObjectType()
export class PaginatedVideoResponse extends PaginatedResponse(Video) {

}
