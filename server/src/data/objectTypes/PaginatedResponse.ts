import { ClassType, Field, ObjectType } from "type-graphql";

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field()
    hasMore: boolean;

    @Field(() => [TItemClass])
    items: TItem[];
  }

  return PaginatedResponseClass;
}
