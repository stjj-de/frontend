import { isLoggedIn } from "@/assets/js/isLoggedIn";

// eslint-disable-next-line func-names
export default function(context) {
  if (!isLoggedIn(context.app)) {
    context.redirect("/login?to=" + encodeURI(context.route.path));
  }
}
