<template>
  <nuxt-link
    class="post-card"
    tag="article"
    :to="`/posts/${post.slug}`"
  >
    <div class="post-card__content">
      <nuxt-link class="post-card__title" :to="`/posts/${post.slug}`">{{ post.title }}</nuxt-link>
      <span class="post-card__excerpt">{{ post.excerpt }}</span>
    </div>
    <div class="post-card__footer">
      <div class="post-card__authors">
        <UserImageWithPopup
          :user="post.author"
        />
      </div>
      <span class="post-card__publication-date">{{ publicationDateString }}</span>
    </div>
  </nuxt-link>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/card";

  .post-card {
    @include card.all();

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    cursor: pointer;
    width: 100%;
    padding-bottom: 16px;

    transition: 400ms ease box-shadow, 200ms linear border-bottom-color;
    border-bottom: 4px solid white;
    &:hover {
      border-bottom: 4px solid #95ccff;
    }
  }

  .post-card__title {
    font-weight: bold;
    font-size: 1.2rem;
    display: block;
    margin-bottom: 5px;
    text-decoration: none;
    color: colors.$background-c;
  }

  .post-card__excerpt {
    font-size: 1.1rem;
  }

  .post-card__footer {
    margin-top: 20px;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .post-card__authors {
    display: flex;
    justify-content: right;

    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }

  .post-card__publication-date {
    margin-top: 10px;
    margin-left: auto;
    padding-left: 20px;

    font-size: 1.2rem;
  }
</style>

<script>
  import { format } from "date-fns"
  import { dateFnsLocale } from "@/assets/js/date-utils"
  import UserImageWithPopup from "@/components/UserImageWithPopup"

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
        return format(new Date(this.post.publishedAt), "d.L.y", { locale: dateFnsLocale })
      }
    },
    POST_FIELDS: ["slug", "title", "excerpt", "publishedAt", "author"],
    POST_AUTHOR_FIELDS: UserImageWithPopup.USER_FIELDS
  }
</script>
