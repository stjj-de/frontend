export async function validateSlug(api, value) {
  const post = await api.posts.get("_" + value, ["id"])

  if (post !== null)
    return "Es existiert bereits ein Post mit diesem Slug."

  return null
}
