<template>
  <main class="account-page formatted">
    <h1>Dein Account</h1>
    <section>
      <h2 class="heading--4">Daten</h2>
      <img class="account-page__image" :src="imageURL" alt="Profilbild">
      <p>Nutzername (zum Anmelden): {{ user.username }}</p>
      <p>Echter Name (nicht öffentlich sichtbar): {{ user.realName }}</p>
      <p>Anzeigename (öffentlich sichtbar): {{ user.displayName }}</p>
      <p>Position (öffentlich sichtbar): {{ user.position }}</p>
      <p>Gruppen: {{ user.groups.length === 0 ? '/' : user.groups.join(", ") }}</p>
      <p v-if="user.role !== 'NONE'">Rolle: {{ user.role }}</p>
    </section>
    <section>
      <h2 class="heading--4">Hinweis</h2>
      <p>
        Wenn du diese Angaben ändern möchtest, melde dich bei
        <a :href="`mailto:${webmaster.email}`">{{ webmaster.name }}</a>.
      </p>
    </section>
    <section>
      <h2 class="heading--4">Neues Passwort festlegen</h2>
      <form class="account-page__password-form" action="javascript:" @submit="onPasswordSubmit()">
        <InputField
          label="Neues Passwort"
          autocomplete="new-password"
          :companion="newPasswordField"
        />
        <MyButton
          class="account-page__password-form-submit"
          variant="primary"
          is-submit
          :disabled="!newPasswordField.valid"
          :loading="newPasswordLoading"
        >
          Speichern
        </MyButton>
      </form>
    </section>
  </main>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .account-page__image {
    border-radius: 50%;
    margin: 20px;
    box-shadow: 0 5px 40px 0 transparentize(colors.$background-c, 0.8);
    max-width: 200px;
  }

  .account-page__password-form {
    max-width: 400px;
  }

  .account-page__password-form-submit {
    float: right;
    margin-top: 10px;
  }
</style>

<script>
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import { WEBMASTER } from "@/assets/js/webmasterDetails";
  import MyButton from "@/components/MyButton";
  import { getUserImageURL } from "@/assets/js/getFileURL";

  export default {
    name: "account",
    components: { MyButton, InputField },
    data() {
      return {
        newPasswordLoading: false,
        webmaster: WEBMASTER,
        newPasswordField: new InputFieldCompanion({
          type: "password",
          validate: value => {
            if (value.length <= 10) {
              return "Das Passwort muss mindestens 10 Zeichen lang sein.";
            }

            if (value.length >= 100) {
              return "Das Passwort darf höchstens 100 Zeichen lang sein.";
            }

            return null;
          }
        })
      };
    },
    computed: {
      user: vm => vm.$store.state.user,
      imageURL: vm => getUserImageURL(vm.user.image)
    },
    methods: {
      async onPasswordSubmit() {
        if (!this.newPasswordField.valid) return;

        this.newPasswordLoading = true;
        await this.$axios.$put("/api/auth/password", this.newPasswordField.value);

        this.newPasswordField.setValueAndReset("");
        this.newPasswordLoading = false;
      }
    }
  };
</script>
