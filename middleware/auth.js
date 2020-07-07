export default async function({ app, redirect, route, store }) {
  const result = await app.$axios.get("/api/auth/me", { validateStatus: status => [200, 403].includes(status) });
  if (result.status === 403) {
    redirect("/login?to=" + encodeURI(route.path));
  } else {
    store.commit("setUserID", result.data.id);
  }
}
