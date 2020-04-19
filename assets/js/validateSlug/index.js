import PostBySlugQuery from "./postBySlugQuery.graphql";

export async function validateSlug(apollo, value) {
  const { data: { postBySlug: post } } = await apollo.query({
    query: PostBySlugQuery,
    variables: {
      slug: value
    },
    fetchPolicy: "network-only"
  });

  if (post !== null) {
    return "Es existiert bereits ein Post mit diesem Slug.";
  }

  return null;
}
