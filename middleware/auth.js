import { getLoggedInUser } from "@/assets/js/getLoggedInUser";

// eslint-disable-next-line func-names
export default function(context) {
  if (getLoggedInUser(context.app.$axios) === null) {
    context.redirect("/login?to=" + encodeURI(context.route.path));
  }
}
