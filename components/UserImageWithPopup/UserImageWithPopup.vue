<template>
  <div
    class="user-image-with-popup"
    tabindex="0"
    :data-ignore-focus="ignoreFocus"
    @click="onClick"
    @blur="ignoreFocus = false"
  >
    <img
      class="user-image-with-popup__image"
      :alt="user.name"
      :src="getImageURL(user.image)"
    >
    <div
      class="user-image-with-popup__popup"
      ref="popup"
    >
      <img
        class="user-image-with-popup__popup-image"
        :alt="user.displayName"
        :src="getImageURL(user.image)"
      >
      <div class="user-image-with-popup__popup-text">
        <span class="user-image-with-popup__name">
        {{ user.displayName }}
      </span>
        <span class="user-image-with-popup__position" v-if="user.position !== null">
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

  .user-image-with-popup__image:hover ~ .user-image-with-popup__popup,
  .user-image-with-popup:focus:not([data-ignore-focus]) > .user-image-with-popup__popup {
    opacity: 1;
  }

  .user-image-with-popup__image, .user-image-with-popup__popup-image {
    position: relative;

    border-radius: 50%;
    height: $size;

    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.3); // TODO: Replace with variable
  }

  .user-image-with-popup__popup-image {
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3); // TODO: Replace with variable
  }

  .user-image-with-popup__popup {
    pointer-events: none;
    opacity: 0;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1); // TODO: Replace with variable

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

  .user-image-with-popup__popup-text {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  .user-image-with-popup__name {
    position: relative;
    white-space: nowrap;
    font-size: 1.2rem;
  }

  .user-image-with-popup__position {
    white-space: nowrap;
    font-size: 1rem;
  }
</style>

<script>
  import { getImageURL } from "@/assets/js/getUploadURL";

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
