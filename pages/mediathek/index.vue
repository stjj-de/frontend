<template>
  <div class="mediathek-page">
    <NavigationBar title="Mediathek"/>
    <main class="content">
      <h1 class="heading--1">
        Mediathek
      </h1>
      <div class="mediathek-page__videos" v-if="videos">
        <nuxt-link
          v-for="(video, index) in videos.items"
          :key="video.id"
          class="mediathek-page__video"
          tag="div"
          :title="video.title"
          :to="`/mediathek/${video.id}`"
        >
          <YoutubeThumbnail
            class="mediathek-page__video-thumbnail"
            :size="index === 0 ? 'highest' : 'medium'"
            :video-id="video.videoID"
          />
          <div class="mediathek-page__video-meta">
            <span class="mediathek-page__video-title">{{ video.title }}</span>
            <span class="mediathek-page__video-date">{{ formatVideoDate(video.publicationDate) }}</span>
          </div>
        </nuxt-link>
      </div>
      <MyButton
        v-if="$apollo.queries.videos.loading || videos.hasMore"
        class="mediathek-page__load-more"
        :loading="$apollo.queries.videos.loading"
        @click="fetchMore()"
      >
        Mehr laden
      </MyButton>
    </main>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/card";
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/screenSize";
  @use "~@/assets/styles/transitions";

  .mediathek-page__videos {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-flow: row;
    gap: 20px;
  }

  .mediathek-page__video {
    @include card.all;
    padding: 0;
    cursor: pointer;

    // i don't understand this
    // https://dev.to/timhecker/grid-cell-issue-with-white-space-nowrap--text-overflow-ellipsis-52g6
    min-width: 0;

    display: flex;
    flex-direction: column;

    grid-column: span 1;
    grid-row: span 1;

    animation: 1s ease mediathek-page__fade-in both;

    &:first-child {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

  @keyframes mediathek-page__fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .mediathek-page__video-thumbnail {
    display: block;
    object-fit: cover;
    width: 100%;
    flex-grow: 1;
  }

  .mediathek-page__video-meta {
    padding: 10px 20px;
  }

  .mediathek-page__video-title {
    font-size: 1.2rem;
    display: block;
    width: 100%;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .mediathek-page__video-date {
    display: block;
    margin-top: 5px;
    color: transparentize(colors.$background-c, 0.3);
    font-size: 1.1rem;
  }

  @media (max-width: 800px) {
    .mediathek-page__videos {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 600px) {
    .mediathek-page__videos {
      grid-template-columns: 1fr;
    }

    .mediathek-page__video:first-child {
      grid-column: span 1;
      grid-row: span 1;
    }
  }

  .mediathek-page__load-more {
    display: block;
    margin: 30px auto 0;
  }
</style>

<script>
  import uniqBy from "lodash.uniqby";
  import VideosQuery from "./videosQuery.graphql";
  import NavigationBar from "@/components/NavigationBar";
  import YoutubeThumbnail from "@/components/YoutubeThumbnail";
  import { formatDateWithOptionalTime } from "@/assets/js/dateUtils";
  import MyButton from "@/components/MyButton";

  export default {
    name: "MediathekPage",
    components: { MyButton, YoutubeThumbnail, NavigationBar },
    head: () => ({
      title: "Mediathek"
    }),
    apollo: {
      videos: {
        query: VideosQuery,
        variables: {
          skip: 0,
          take: 10
        }
      }
    },
    methods: {
      formatVideoDate(date) {
        return formatDateWithOptionalTime(date);
      },
      fetchMore() {
        this.$apollo.queries.videos.fetchMore({
          variables: {
            skip: this.videos.items.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => ({
            videos: {
              __typename: previousResult.videos.__typename,
              items: uniqBy([
                ...previousResult.videos.items,
                ...fetchMoreResult.videos.items
              ], video => video.id),
              hasMore: fetchMoreResult.videos.hasMore
            }
          })
        });
      }
    }
  };
</script>
