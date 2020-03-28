import { Field, ObjectType } from "type-graphql";
import { Event } from "../models/Event";

@ObjectType()
export class EventsPagination {
  @Field()
  hasMore: boolean;

  @Field(() => [Event])
  items: Event[];
}
