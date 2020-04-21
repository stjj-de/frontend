import { registerEnumType } from "type-graphql";

export enum UploadedFileSortField {
  TITLE = "title",
  MIME_TYPE = "mimeType",
  ALIAS = "alias",
  UPLOAD_DATE = "uploadDate"
}

registerEnumType(UploadedFileSortField, {
  name: "UploadedFileSortField",
  description: "The field by which the data will be sorted."
});
