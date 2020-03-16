<template>
  <div
    class="user-image-with-popup"
    tabindex="0"
    :data-ignore-focus="ignoreFocus"
    @click="onClick"
    @blur="ignoreFocus = false"
  >
    <img
      class="_image"
      :alt="user.name"
      :src="getImageURL(user.image)"
    >
    <div
      class="_popup"
      ref="popup"
    >
      <img
        class="_popup-image"
        :alt="user.displayName"
        :src="getImageURL(user.image)"
      >
      <div class="_popup-text">
        <span class="_name">
        {{ user.displayName }}
      </span>
        <span class="_position" v-if="user.position !== null">
        {{ user.position }}
      </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  $size: 40px;

  .user-image-with-popup {
    cursor: auto;
    position: relative;
    width: $size;
    margin: 5px;

    &:focus {
      outline: none;
    }
  }

  ._image:hover ~ ._popup, .user-image-with-popup:focus:not([data-ignore-focus]) > ._popup {
    opacity: 1;
  }

  ._image, ._popup-image {
    position: relative;

    border-radius: 50%;
    height: $size;

    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.3);
  }

  ._popup-image {
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3);
  }

  ._popup {
    pointer-events: none;
    opacity: 0;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

    position: absolute;
    top: -10px;
    left: -10px;
    z-index: 2;

    background-color: white;
    border-radius: 10px;
    min-height: 60px;
    padding: 10px;
    display: flex;

    transition: 200ms ease opacity;
  }

  ._popup-text {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  ._name {
    position: relative;
    white-space: nowrap;
    font-size: 1.2rem;
  }

  ._position {
    white-space: nowrap;
    font-size: 1rem;
  }
</style>

<script>
  import { getImageURL } from "@/assets/getUploadURL";

  export default {
    name: "UserImageWithPopup",
    components: { },
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      ignoreFocus: false
    }),
    methods: {
      getImageURL,
      onClick(event) {
        event.preventDefault();
        this.ignoreFocus = true;
      }
    }
  };
</script>
