export function isLoggedIn(instance) {
  const token = instance.$apolloHelpers.getToken();

  return token !== undefined;
}
