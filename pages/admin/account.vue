<template>
  <main class="account-page formatted">
    <h1>Dein Account</h1>
    <section>
      <h2 class="heading--4">Daten</h2>
      <div class="account-page__image-section">
        <img class="account-page__image" :src="imageURL" alt="Profilbild">
        <FileUploadButton vertical mime-type="image/png" :after-upload-action="afterProfileImageUpload">
          Neues Profilbild hochladen
        </FileUploadButton>
      </div>
      <div v-for="field in fields" :key="field.key" class="account-page__field">
        <span class="account-page__field-label">{{ field.label }}</span>
        <span class="account-page__field-value">
          {{ field.transform === undefined ? user[field.key] : field.transform(user[field.key]) }}
        </span>
      </div>
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
      <form class="account-page__password-form" action="javascript:" @submit="onPasswordSubmit">
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

  .account-page__image-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .account-page__image {
    border-radius: 50%;
    margin: 20px;
    box-shadow: 0 5px 40px 0 transparentize(colors.$background-c, 0.8);
    height: 200px;
    width: 200px;
    object-fit: cover;
  }

  .account-page__field {
    margin-top: 20px;
  }

  .account-page__field-label {
    text-transform: uppercase;
    color: transparentize(colors.$background-c, 0.4);
    font-size: 1.05rem;
    display: block;
  }

  .account-page__field-value {
    font-size: 1.2rem;
    display: block;
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
  import InputField from "@/components/InputField/InputField"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion"
  import { WEBMASTER } from "@/assets/js/webmaster-details"
  import MyButton from "@/components/MyButton"
  import { getUserImageURL } from "@/assets/js/get-file-url"
  import FileUploadButton from "@/components/FileUploadButton"

  const DISPLAYED_FIELDS = [
    {
      key: "realName",
      label: "Echter Name"
    },
    {
      key: "displayName",
      label: "Anzeigename"
    },
    {
      key: "position",
      label: "Position"
    },
    {
      key: "username",
      label: "Benutzername (zum Anmelden)"
    },
    {
      key: "groups",
      label: "Gruppen",
      transform: groups => groups.length === 0 ? "—" : groups.map(group => group.title).join(", ")
    }
  ]

  export default {
    name: "AccountPage",
    components: { FileUploadButton, MyButton, InputField },
    data() {
      return {
        fields: DISPLAYED_FIELDS,
        newPasswordLoading: false,
        webmaster: WEBMASTER,
        afterProfileImageUpload: async ({ id }) => {
          await this.$api.users.update(this.user.id, { image: id })
          this.$store.commit("setUser", { ...this.user, image: id })
        },
        newPasswordField: new InputFieldCompanion({
          type: "password",
          validate: value => {
            if (value.length < 10)
              return "Das Passwort muss mindestens 10 Zeichen lang sein."

            if (value.length > 100)
              return "Das Passwort darf höchstens 100 Zeichen lang sein."

            return null
          }
        })
      }
    },
    computed: {
      user: vm => vm.$store.state.user,
      imageURL: vm => getUserImageURL(vm.user.image)
    },
    methods: {
      async onPasswordSubmit() {
        if (!this.newPasswordField.valid) return

        this.newPasswordLoading = true
        await this.$api.users.update(this.user.id, { password: this.newPasswordField.value })

        this.newPasswordField.setValueAndReset("")
        this.newPasswordLoading = false
      }
    }
  }
</script>
