import { ObjectType } from "type-graphql";
import { Post } from "../models/Post";
import { PaginatedResponse } from "./PaginatedResponse";

@ObjectType()
export class PaginatedPostResponse extends PaginatedResponse(Post) {

}
