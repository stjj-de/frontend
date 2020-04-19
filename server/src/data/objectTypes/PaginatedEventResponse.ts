import { ObjectType } from "type-graphql";
import { Event } from "../models/Event";
import { PaginatedResponse } from "./PaginatedResponse";

@ObjectType()
export class PaginatedEventResponse extends PaginatedResponse(Event) {

}
