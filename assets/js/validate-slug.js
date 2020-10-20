export async function validateSlugAsync(api, value) {
  const post = await api.posts.get("_" + value, ["id"])

  if (post !== null)
    return "Es existiert bereits ein Post mit diesem Slug."

  return null
}

export function validateSlug(value) {
  if (value.startsWith("-") || value.endsWith("-"))
    return "Slugs dürfen nicht mit \"-\" anfangen oder enden."

  if (new TextEncoder().encode(value).length > 50)
    return "Slugs dürfen maximal 50 Zeichen lang sein. Manche Zeichen zählen als mehrere Zeichen."

  return null
}
