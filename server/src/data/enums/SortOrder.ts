import { registerEnumType } from "type-graphql";

export enum SortOrder {
  DESCENDING = "DESC",
  ASCENDING = "ASC"
}

registerEnumType(SortOrder, {
  name: "SortOrder",
  description: "The order in which the sorted data will be returned."
});
