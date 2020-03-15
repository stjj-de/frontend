<template>
  <div
    class="user-image-with-popup"
    tabindex="0"
    :style="`z-index: ${index}`"
    :data-ignore-focus="ignoreFocus"
    @click="onClick"
    @blur="ignoreFocus = false"
  >
    <GlobalEvents
      target="window"
      @resize="onWindowResize"
    />
    <img
      class="_image"
      :alt="user.name"
      :src="getImageURL(user.image)"
    >
    <div
      class="_popup"
      ref="popup"
      :data-inverted="inverted"
    >
      <span class="_name">
        {{ user.name }}
      </span>
      <span class="_position" v-if="user.position !== null">
        {{ user.position }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  $size: 40px;

  .user-image-with-popup {
    cursor: auto;
    position: relative;
    width: $size;

    &:focus {
      outline: none;
    }
  }

  ._image:hover ~ ._popup, .user-image-with-popup:focus:not([data-ignore-focus]) > ._popup {
    opacity: 1;
    pointer-events: auto;
  }

  ._image {
    position: relative;
    z-index: 1;

    border-radius: 50%;
    height: $size;
  }

  ._popup {
    pointer-events: none;
    opacity: 0;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

    position: absolute;
    top: -10px;
    left: -10px;

    background-color: white;
    border-radius: 10px;
    min-height: 60px;
    padding: 10px 10px 10px 60px;

    transition: 200ms ease opacity;

    &[data-inverted] {
      left: unset;
      right: -10px;
      padding: 10px 60px 10px 10px;
    }
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
  import GlobalEvents from "vue-global-events";
  import throttle from "lodash.throttle";
  import { getImageURL } from "@/assets/getUploadURL";

  export const userFragment = gql`
    fragment UserImageWithPopupUserFields on User {
      name
      position
      image
    }
  `;

  const throttledOnWindowResize = throttle(vm => {
    const element = vm.$refs.popup;

    vm.inverted = element.getBoundingClientRect().right > window.innerWidth;
  }, 200, { leading: true });

  export default {
    name: "UserImageWithPopup",
    components: { GlobalEvents },
    props: {
      user: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        default: 0
      }
    },
    data: () => ({
      ignoreFocus: false,
      inverted: false
    }),
    methods: {
      getImageURL,
      onClick(event) {
        event.preventDefault();
        this.ignoreFocus = true;
      },
      onWindowResize() {
        throttledOnWindowResize(this);
      }
    }
  };
</script>
