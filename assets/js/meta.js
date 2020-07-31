import { HOMEPAGE_URL } from "@/assets/js/homepageURL";

export function createMeta({ title, description, path }) {
  return [
    {
      hid: "og:title",
      property: "og:title",
      content: title
    },
    {
      hid: "description",
      property: "description",
      content: description
    },
    {
      hid: "og:description",
      property: "og:description",
      content: description
    },
    {
      hid: "og:url",
      property: "og:url",
      content: HOMEPAGE_URL + path
    }
  ];
}
