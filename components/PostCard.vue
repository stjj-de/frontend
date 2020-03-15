<template>
  <nuxt-link
    class="post-card"
    tag="article"
    :to="`/posts/${post.slug}`"
  >
    <nuxt-link class="_title" :to="`/posts/${post.slug}`">{{ post.title }}</nuxt-link>
    <span class="_excerpt">{{ post.excerpt }}</span>
    <div class="_footer">
      <div class="_authors">
        <UserImageWithPopup
          v-for="author in post.authors"
          :key="author.id"
          :user="author"
        />
      </div>
      <span class="_publication-date">{{ publicationDateString }}</span>
    </div>
  </nuxt-link>
</template>

<style scoped lang="scss">
  .post-card {
    cursor: pointer;

    padding: 40px 40px 30px;

    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.1);

    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    transition: 400ms ease box-shadow;
    &:hover {
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    }
  }

  ._title {
    font-weight: bold;
    font-size: 1.2rem;
    display: block;
    margin-bottom: 5px;
    text-decoration: none;
    color: var(--colors-background-c)
  }

  ._excerpt {
    font-size: 1.1rem;
  }

  ._footer {
    margin-top: 20px;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  ._authors {
    display: flex;
    justify-content: right;

    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }

  ._publication-date {
    margin-top: 10px;
    margin-left: auto;
    padding-left: 20px;

    font-size: 1.2rem;
  }
</style>

<script>
  import gql from "graphql-tag";
  import { de } from "date-fns/locale";
  import { format } from "date-fns";
  import UserImageWithPopup, { userFragment as userImageWithPopupUserFragment } from "@/components/UserImageWithPopup";

  export const postFragment = gql`
    fragment PostCardPostFields on Post {
      slug
      title
      excerpt
      authors {
        id
        name
        position
        image
        ...UserImageWithPopupUserFields
      }
      publicationDate
      relevantUntil
    }

    ${userImageWithPopupUserFragment}
  `;

  export default {
    name: "PostCard",
    components: { UserImageWithPopup },
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    computed: {
      publicationDateString() {
        return format(new Date(this.post.publicationDate), "d.L.y", { locale: de });
      }
    }
  };
</script>
