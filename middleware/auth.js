import { isLoggedIn } from "@/assets/isLoggedIn";

export default function(context) {
  if (!isLoggedIn(context.app)) {
    context.redirect("/login?to=" + encodeURI(context.route.path));
  }
}
