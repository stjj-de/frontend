import { APIWrapper } from "@/assets/js/APIWrapper";

export default (context, inject) => {
  inject("api", new APIWrapper(context.$axios));
}
