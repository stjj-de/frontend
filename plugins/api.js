import { APIWrapper } from "@/assets/js/api-wrapper"

export default (context, inject) => {
  inject("api", new APIWrapper(context.$axios))
}
