<template>
  <div
    class="user-image-with-popup"
    :style="`z-index: ${index}`"
  >
    <img
      class="_image"
      :alt="author.name"
      :src="getImageURL(author.image)"
    >
    <div class="_popup">
      <span class="_name">
        {{ author.name }}
      </span>
      <span class="_position" v-if="author.position !== null">
        {{ author.position }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-image-with-popup {
    position: relative;
    transition: 400ms ease transform;

    &:hover {
      &:not(:first-child) {
        transform: translateX(8px);
      }

      & > ._popup {
        opacity: 1;
      }
    }
  }

  ._image {
    position: relative;
    z-index: 1;

    border-radius: 50%;
    height: 40px;
  }

  ._popup {
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.17);

    position: absolute;
    top: -10px;
    left: -10px;

    background-color: white;
    border-radius: 10px;
    min-height: 60px;
    padding: 10px 10px 10px 60px;

    transition: 200ms ease opacity;
  }

  ._name {
    white-space: nowrap;
    font-size: 1.2rem;
  }

  ._position {
    white-space: nowrap;
    font-size: 1rem;
  }
</style>

<script>
  import gql from "graphql-tag";
  import { getImageURL } from "@/assets/getUploadURL";

  export const userFragment = gql`
    fragment UserFields on User {
      name
      position
      image
    }
  `;

  export default {
    name: "UserImageWithPopup",
    props: {
      author: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        default: 0
      }
    },
    methods: {
      getImageURL
    }
  };
</script>
