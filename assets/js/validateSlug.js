export async function validateSlug(apollo, value) {
  const post = null; // TODO

  if (post !== null) {
    return "Es existiert bereits ein Post mit diesem Slug.";
  }

  return null;
}
