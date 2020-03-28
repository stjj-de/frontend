import { ArgsType, Field, Int } from "type-graphql";

export interface IPaginationArgs {
  skip: number;
  take: number | null;
}

@ArgsType()
export class PaginationArgs implements IPaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number | null;
}
