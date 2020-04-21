import { ArgsType, Field, Int } from "type-graphql";

export interface IPaginationArgs {
  skip: number;
  take: number;
}

@ArgsType()
export class PaginationArgs implements IPaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  skip: number;

  @Field(() => Int, { defaultValue: 40 })
  take: number;
}
