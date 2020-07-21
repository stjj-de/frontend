<template>
  <div class="admin-navigation" :data-open="open">
    <div class="admin-navigation__toggle" @click="open = !open">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <nav class="admin-navigation__container">
      <div class="admin-navigation__top">
        <LoadingPlaceholder v-if="meLoading" height="80px"/>
        <nuxt-link
          v-else
          class="admin-navigation__profile admin-navigation__item"
          :to="`/admin/users/${me.id}`"
          v-ripple.400="'rgba(0,0,0,0.1)'"
          @click="open = false"
        >
          <img class="admin-navigation__image" alt="Dein Profilbild" :src="getUserImageURL(me.id)">
          <div class="admin-navigation__logged-in-as">
            Angemeldet als
            <span class="admin-navigation__name">{{ me.realName }}</span>
          </div>
        </nuxt-link>
        <nuxt-link
          v-for="(item, index) in $options.items"
          :key="index"
          class="admin-navigation__item"
          :to="item.to"
          v-ripple.400="'rgba(0,0,0,0.1)'"
          @click.native="open = false"
        >
          <component :is="item.icon" class="admin-navigation__icon"/>
          {{ item.label }}
        </nuxt-link>
      </div>
      <nuxt-link class="admin-navigation__back admin-navigation__item" to="/">
        <ArrowLeftIcon class="admin-navigation__icon"/>
        Zurück zur Seite
      </nuxt-link>
    </nav>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/screenSize";
  @use "~@/assets/styles/colors";

  .admin-navigation {
    width: 350px;
    flex-shrink: 0;
    height: 100vh;
    box-shadow: 0 0 40px 0 transparentize(colors.$background-c, 0.9);

    position: fixed;
    top: 0;
    bottom: 0;

    &[data-open] {
      ._toggle > span {
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

      .admin-navigation__container {
        pointer-events: auto;
        opacity: 1;
      }
    }
  }

  .admin-navigation__container {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 10px;
  }

  .admin-navigation__top {
    display: flex;
    flex-direction: column;
  }

  .admin-navigation__logged-in-as {
    display: flex;
    flex-direction: column;
    font-size: 1.3rem;
  }

  .admin-navigation__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px;

    margin: 3px 5px;
    border-radius: 5px;

    color: black;
    text-decoration: none;
    font-size: 1.5rem;

    transition: 100ms linear background-color;
    &:hover, &:focus {
      background-color: colors.$hover-and-focus;
    }

    &.nuxt-link-active:not(.admin-navigation__back) {
      background-color: colors.$active;
    }
  }

  .admin-navigation__icon {
    width: 30px;
  }

  .admin-navigation__profile {
    display: flex;
    align-items: center;
    padding: 10px 30px 10px 20px;

    color: black;
    text-decoration: none;
    font-size: 1.5rem;
  }

  .admin-navigation__name {
    font-size: 1.8rem;
  }

  .admin-navigation__image {
    border-radius: 50%;
    margin-right: 20px;
    height: 50px;
  }

  .admin-navigation__toggle {
    display: none;

    position: relative;
    left: 30px;

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

  .admin-navigation__back {
    justify-content: flex-start;
    font-size: 1.2rem;
    padding-left: 10px;

    & > :first-child {
      margin-right: 10px;
    }
  }

  @media(max-width: 1000px) {
    $height: 70px;

    .admin-navigation {
      height: $height;
      width: 100vw;
      display: flex;
      align-items: center;
      box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.2);
      margin: 0;

      position: fixed;
      top: 0;
      z-index: 20;

      background-color: colors.$background;
    }

    .admin-navigation__toggle {
      display: block;
      z-index: 2;
    }

    .admin-navigation__container {
      padding-top: $height;
      background-color: colors.$background;

      pointer-events: none;
      opacity: 0;
      transition: 200ms linear opacity;

      position: absolute;
      top: 0;
      z-index: 1;
      height: 100vh;
    }
  }
</style>

<script>
  import CalendarIcon from "@/assets/icons/calendar.svg";
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
  import PencilIcon from "@/assets/icons/pencil.svg";
  import ChurchIcon from "@/assets/icons/church.svg";
  import VideoIcon from "@/assets/icons/video.svg";
  import { getUserImageURL } from "@/assets/js/getFileURL";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import LoadingPlaceholder from "@/components/LoadingPlaceholder";

  const ITEMS = [
    {
      label: "Artikel",
      to: "/admin/posts",
      icon: PencilIcon
    },
    {
      label: "Kalender",
      to: "/admin/calendar",
      icon: CalendarIcon
    },
    {
      label: "Gottesdienste",
      to: "/admin/gottesdienste",
      icon: ChurchIcon
    },
    {
      label: "Videos",
      to: "/admin/videos",
      icon: VideoIcon
    }
  ];

  export default {
    name: "AdminNavigation",
    components: { LoadingPlaceholder, LoadingOverlay, ArrowLeftIcon },
    data: () => ({
      open: false,
      me: {},
      meLoading: true
    }),
    methods: {
      getUserImageURL
    },
    async created() {
      this.me = await this.$api.users.get(this.$store.state.userID, ["id", "realName"]);
      this.meLoading = false;
    },
    items: ITEMS
  };
</script>
