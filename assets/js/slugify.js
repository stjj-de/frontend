import { createSlug } from "speakingurl"

// https://github.com/pid/speakingurl#getsluginput-options
export const slugify = createSlug({
  separator: "-",
  lang: "de"
})
