<template>
  <div class="navigation-bar" :class="classes">
    <div class="navigation-bar__placeholder"></div>
    <nav class="navigation-bar__content">
      <div class="navigation-bar__title-container">
      <span
        class="navigation-bar__title"
        :class="{ 'navigation-bar__title--show': showTitle }"
      >
        {{ title }}
      </span>
      </div>
      <div class="navigation-bar__toggle" @click="open = !open">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="navigation-bar__links">
        <template v-for="item in $options.items">
          <nuxt-link
            v-if="item.to"
            :key="item.label"
            class="navigation-bar__link"
            :to="item.to"
            @click.native.passive="open = false"
          >
            {{ item.label }}
          </nuxt-link>
          <a
            v-else
            class="navigation-bar__link"
            :key="item.label"
            rel="noopener"
            :href="item.href"
            @click.passive="open = false"
          >
            {{ item.label }}
          </a>
        </template>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/content";
  @use "~@/assets/styles/z-indexes";

  body {
    --navigation-bar-height: 80px;
  }

  .navigation-bar__placeholder {
    height: var(--navigation-bar-height);
  }

  .navigation-bar__content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: z-indexes.$navigation-bar;

    height: var(--navigation-bar-height);

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;

    .navigation-bar--show-background & {
      background: colors.$background;
    }
  }

  .navigation-bar__toggle {
    position: relative;
    z-index: 1;

    & > span {
      display: block;
      background-color: colors.$background-c;

      width: 30px;
      height: 2px;

      transition: 200ms linear;
      transition-property: opacity, transform;

      &:nth-child(2) {
        margin-top: 8px;
      }

      &:nth-child(3) {
        margin-top: 8px;
      }
    }
  }

  .navigation-bar__title-container {
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .navigation-bar__title {
    font-size: 1.4rem;
    font-weight: bold;
    display: block;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    opacity: 0;
    transform: translateY(10px);
    transition: 200ms ease;
    transition-property: opacity, transform;

    &.navigation-bar__title--show {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .navigation-bar__links {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;

    width: 100vw;
    height: 100vh;

    background: colors.$background;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    opacity: 0;
    pointer-events: none;
    transition: 200ms ease opacity;
    border: none;

    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .navigation-bar__link {
    position: relative;
    color: colors.$background-c;
    text-decoration: none;
    font-size: 2rem;

    transition: 200ms transform ease;

    &:hover {
      &::after {
        opacity: 1;
      }
    }

    &::after {
      content: "";
      position: absolute;
      top: 40px;
      left: 0;
      width: 100%;
      height: 2px;
      background: colors.$background-c;

      opacity: 0;
      transition: 200ms ease opacity;
    }

    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .navigation-bar--open {
    .navigation-bar__toggle > span {
      &:nth-child(1) {
        transform: translateY(10px) rotate(45deg);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: translateY(-10px) rotate(-45deg);
      }
    }

    .navigation-bar__links {
      opacity: 1;
      pointer-events: auto;
    }
  }

  @include screenSize.notMobile {
    body {
      --navigation-bar-height: 100px;
    }

    .navigation-bar__content {
      @include content.content(40px);
    }

    .navigation-bar__title {
      font-size: 2.5rem;
    }

    .navigation-bar__toggle {
      display: none;
    }

    .navigation-bar__links {
      position: static;
      width: auto;
      height: auto;
      opacity: 1;
      pointer-events: auto;

      flex-direction: row;

      background: transparent;
    }

    .navigation-bar__link:not(:last-child) {
      margin-bottom: 0;
      margin-right: 20px;
    }

    .navigation-bar__link {
      font-size: 1.3rem;

      &::after {
        top: 30px;
      }
    }
  }
</style>

<script>
  import { toModifierClasses } from "@/assets/js/toModifierClasses";

  const ITEMS = [
    {
      label: "Start",
      to: "/"
    },
    {
      label: "Aktuelles",
      to: "/aktuelles"
    },
    {
      label: "Gottesdienste",
      to: "/gottesdienste"
    },
    // {
    //   label: "Gruppierungen",
    //   to: "/gruppierungen"
    // },
    {
      label: "Mediathek",
      to: "/mediathek"
    }
  ];

  export default {
    name: "NavigationBar",
    props: {
      backgroundAfterScroll: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      }
    },
    data: () => ({
      open: false,
      scrollPosition: 0
    }),
    computed: {
      showTitle: vm => vm.scrollPosition > 60,
      showBackground: vm => vm.backgroundAfterScroll ? vm.scrollPosition > 0 : true,
      classes() {
        const { open, showBackground } = this;

        return toModifierClasses("navigation-bar", {
          open,
          showBackground
        });
      }
    },
    mounted() {
      const scrollListener = () => {
        this.scrollPosition = window.scrollY;
      };

      window.addEventListener("scroll", scrollListener, { passive: true });

      this.$on("hook:beforeDestroy", () => {
        window.removeEventListener("scroll", scrollListener);
      });

      scrollListener();
    },
    items: ITEMS
  };
</script>
