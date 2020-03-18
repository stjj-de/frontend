import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class EmptyResponse {
  @Field(() => Boolean)
  readonly _ = true;
}
