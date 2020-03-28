<template>
  <div class="admin-navigation" :data-open="open">
    <div class="admin-navigation__toggle" @click="open = !open">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <nav class="admin-navigation__container">
      <LoadingPlaceholder v-if="$apollo.queries.me.loading" height="80px"/>
      <nuxt-link
        v-else
        class="admin-navigation__profile"
        :to="`/admin/users/${me.id}`"
        v-ripple.400="'rgba(0,0,0,0.1)'"
        @click="open = false"
      >
        <img class="admin-navigation__image" alt="Dein Profilbild" :src="getImageURL(me.image)">
        <div class="admin-navigation__logged-in-as">
          Angemeldet als
          <span class="admin-navigation__name">{{ me.name }}</span>
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
    </nav>
  </div>
</template>

<style lang="scss">
  @use "~kiste/css/mixins/screenSize";

  .admin-navigation {
    width: 350px;
    flex-shrink: 0;
    height: 100vh;
    box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.1);

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
  }

  .admin-navigation__logged-in-as {
    display: flex;
    flex-direction: column;
    font-size: 1.3rem;
  }

  .admin-navigation__profile {
    display: flex;
    align-items: center;
    padding: 10px 30px 10px 20px;
    margin: 5px 0;

    color: black;
    text-decoration: none;
    font-size: 1.5rem;

    &.nuxt-link-active, &:hover {
      background-color: rgba(35, 174, 255, 0.1);
    }
  }

  .admin-navigation__name {
    font-size: 1.8rem;
  }

  .admin-navigation__image {
    border-radius: 50%;
    margin-right: 20px;
    height: 50px;
  }

  .admin-navigation__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px;

    margin: 5px 0;
    color: black;
    text-decoration: none;
    font-size: 1.5rem;

    transition: 100ms linear background-color;
    &.nuxt-link-active, &:hover {
      background-color: rgba(35, 174, 255, 0.1);
    }
  }

  .admin-navigation__icon {
    width: 30px;
  }

  .admin-navigation__toggle {
    display: none;

    position: relative;
    left: 30px;

    & > span {
      display: block;

      background-color: var(--colors-background-c);

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
      z-index: 1;

      background-color: var(--colors-background);
    }

    .admin-navigation__toggle {
      display: block;
      z-index: 2;
    }

    .admin-navigation__container {
      padding-top: $height;
      background-color: var(--colors-background);

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
  import MeQuery from "./MeQuery.graphql";
  import CalendarIcon from "@/assets/icons/calendar.svg";
  import PencilIcon from "@/assets/icons/pencil.svg";
  import UsersIcon from "@/assets/icons/users.svg";
  import { getImageURL } from "@/assets/getUploadURL";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import LoadingPlaceholder from "@/components/LoadingPlaceholder";

  const ITEMS = [
    {
      label: "Artikel",
      to: "/admin/posts",
      icon: PencilIcon
    },
    {
      label: "Ereignisse",
      to: "/admin/events",
      icon: CalendarIcon
    },
    {
      label: "Benutzer",
      to: "/admin/users",
      icon: UsersIcon
    }
  ];

  export default {
    name: "AdminNavigation",
    components: { LoadingPlaceholder, LoadingOverlay },
    data: () => ({
      open: false
    }),
    apollo: {
      me: MeQuery
    },
    methods: {
      getImageURL
    },
    items: ITEMS
  };
</script>
