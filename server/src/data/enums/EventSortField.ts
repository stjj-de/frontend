import { registerEnumType } from "type-graphql";

export enum EventSortField {
  TITLE = "title",
  COLOR = "color",
  DATE = "date",
  END_DATE = "endDate"
}

registerEnumType(EventSortField, {
  name: "EventSortField",
  description: "The field by which the data will be sorted."
});
