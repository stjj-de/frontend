export async function getLoggedInUser(axios) {
  const result = await axios.get("/api/auth/me", { validateStatus: status => [200, 403].includes(status) });
  return result.status === 403 ? null : result.data;
}
