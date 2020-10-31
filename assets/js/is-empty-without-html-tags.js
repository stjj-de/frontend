import stripTags from "striptags"

export function isEmptyWithoutHTMLTags(content) {
  return stripTags(content, ["img"]).trim() === ""
}
