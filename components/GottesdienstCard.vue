<template>
  <div class="gottesdienst-card">
    <span class="gottesdienst-card__time heading--4">
      {{ gottesdienst.time }}
    </span>
    <span class="gottesdienst-card__location">
      {{ gottesdienst.location }}
    </span>
    <span class="gottesdienst-card__description">
      {{ gottesdienst.description }}
    </span>
    <div class="gottesdienst-card__buttons" v-if="showButtons">
      <MyButton v-if="$listeners.delete" variant="danger" @click="$emit('delete')">
        Löschen
      </MyButton>
      <MyButton v-if="$listeners.edit" variant="primary" @click="$emit('edit')">
        Bearbeiten
      </MyButton>
    </div>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";
  @use "~@/assets/styles/card";

  .gottesdienst-card {
    @include card.all;

    font-size: 1.2rem;
  }

  .gottesdienst-card__time {
    margin-top: 0;
  }

  .gottesdienst-card__location::after {
    content: "/";
    color: transparentize(colors.$background-c, 0.5);
    margin: 0 5px;
  }

  .gottesdienst-card__buttons {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;

    & > :not(:last-child) {
      margin-right: 10px;
    }
  }
</style>

<script>
  import MyButton from "@/components/MyButton";

  export default {
    name: "GottesdienstCard",
    components: { MyButton },
    props: {
      gottesdienst: {
        type: Object,
        required: true
      }
    },
    computed: {
      showButtons() {
        return this.$listeners.edit || this.$listeners.delete;
      }
    }
  };
</script>
