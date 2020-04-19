import { registerEnumType } from "type-graphql";

export enum PostSortField {
  TITLE = "title",
  PUBLICATION_DATE = "publicationDate",
  RELEVANT_UNTIL = "relevantUntil",
  SLUG = "slug"
}

registerEnumType(PostSortField, {
  name: "PostSortField",
  description: "The field by which the data will be sorted."
});
