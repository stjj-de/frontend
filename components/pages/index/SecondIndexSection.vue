<template>
  <section class="second-index-section content">
    <div class="_calendar-section">
      <span class="heading--4">
        Termine
      </span>
      <client-only>
        <v-calendar is-expanded/>
      </client-only>
    </div>
    <div class="_posts-section">
      <span class="heading--4">
        Aktuelles
      </span>
      <div v-if="!$apollo.queries.posts.loading" class="_posts">
        <article v-for="post in posts" class="_post" :key="post.id">
          <span class="_post__title">{{ post.title }}</span>
          <span class="_post__excerpt">{{ post.excerpt }}</span>
          <div class="_post__footer">
            <div class="_post__authors">
              <UserImageWithPopup
                v-for="(author, index) in post.authors"
                :key="author.id"
                :author="author"
                :index="post.authors.length - index"
              />
            </div>
            <span class="_post__publication-date">{{ new Date(post.publicationDate).toLocaleDateString() }}</span>
          </div>
        </article>
        <span v-if="posts.length === 0" class="_no-news">
          Zurzeit gibt es keine Neuigkeiten.
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  @use "~kiste/css/mixins/screenSize";

  .second-index-section {
    display: flex;

    @media (max-width: 800px) {
      flex-direction: column-reverse;
    }
  }

  ._calendar-section {
    padding: 20px;
    width: 350px;
  }

  ._posts-section {
    padding: 20px;
    min-width: 200px;
  }

  ._posts {
    display: flex;
    flex-direction: column;

    & > *:not(:last-child) {
      margin-bottom: var(--gutter-size);
    }
  }

  ._post {
    padding: 40px 40px 30px;

    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.1);
  }

  ._post__title {
    font-weight: bold;
    font-size: 1.2rem;
    display: block;
    margin-bottom: 5px;
  }

  ._post__excerpt {
    font-size: 1.1rem;
  }

  ._post__footer {
    margin-top: 20px;

    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  ._post__authors {
    display: flex;

    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }

  ._post__publication-date {
    float: right;
    font-size: 1.2rem;
  }

  ._no-news {
    font-size: 1.3rem;
  }
</style>

<script>
  import gql from "graphql-tag";
  import UserImageWithPopup, { userFragment } from "@/components/UserImageWithPopup";

  export default {
    name: "SecondIndexSection",
    components: { UserImageWithPopup },
    apollo: {
      posts: {
        query: gql`
          query {
            posts(onlyRelevant: true, take: 2) {
              slug
              title
              excerpt
              authors {
                id
                name
                position
                image
                ...UserFields
              }
              publicationDate
              relevantUntil
            }
          }

          ${userFragment}
        `
      }
    }
  };
</script>
