<template>
  <div class="login-page" :data-show="show">
    <div class="login-page__box-container">
      <main class="login-page__box">
        <nuxt-link class="login-page__back link" to="/">
          <ArrowLeftIcon class="login-page__back-arrow"/>
          Zurück zur Startseite
        </nuxt-link>
        <h1 class="heading--3 login-page__heading">
          Anmelden
        </h1>
        <form class="login-page__form" action="javascript:" @submit="submit">
          <InputField
            label="Benutzername"
            autocomplete="username"
            disable-spellcheck
            keep-showing-state
            :companion="username"
          />
          <InputField
            label="Passwort"
            autocomplete="current-password"
            :companion="password"
          />
          <MyButton
            class="login-page__button"
            is-submit
            variant="primary"
            :loading="loading"
            :disabled="!(password.valid && username.valid)"
          >
            Anmelden
          </MyButton>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use "~@/assets/styles/colors";

  .login-page {
    height: 100vh;

    $bg-color: colors.$background;
    $dot-color: transparentize(colors.$background-c, 0.85);

    $dot-size: 3px;
    $dot-space: 60px;

    background:
      linear-gradient(90deg, $bg-color ($dot-space - $dot-size), transparent 1%) center,
      linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
      $dot-color;
    background-size: $dot-space $dot-space;

    opacity: 0;
    transition: 200ms ease opacity;
    &[data-show] {
      opacity: 1;
    }
  }

  .login-page__box-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-page__box {
    background: colors.$background;
    border-radius: 10px;
    box-shadow: 0 10px 100px 2px transparentize(colors.$background-c, 0.8);

    width: 400px;
    padding: 40px;
    overflow: hidden;

    position: relative;
  }

  .login-page__heading {
    margin-bottom: 0;
  }

  .login-page__back {
    font-size: 1.2rem;
    top: 10px;
    left: 10px;

    border-bottom: none;
  }

  .login-page__back-arrow {
    width: 20px;
    position: relative;
    top: 3px;
  }

  .login-page__button {
    display: block;
    margin-left: auto;
    margin-top: 10px;
  }
</style>

<script>
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg"
  import InputField from "@/components/InputField/InputField"
  import { InputFieldCompanion } from "@/components/InputField/input-field-companion"
  import MyButton from "@/components/MyButton"

  export default {
    name: "LoginPage",
    components: { MyButton, InputField, ArrowLeftIcon },
    layout: "none",
    data() {
      return {
        show: false,
        username: new InputFieldCompanion({
          defaultValue: "",
          transform: value => value.trim(),
          required: "Bitte gib deinen Benutzernamen ein.",
          validate: value => {
            if (value.includes(" ")) return "Benutzernamen enthalten keine Leerzeichen."

            return null
          },
          debounceWait: 500,
          validateOrSaveAsync: async value => {
            const { data: user } = await this.$axios.$get(`/api/users/${value}?fields=id`, {
              validateStatus: status => [200, 404].includes(status)
            })

            if (user === null) return "Dieser Benutzername ist ungültig."

            this.userID = user.id
            return null
          }
        }),
        password: new InputFieldCompanion({
          defaultValue: "",
          type: "password",
          required: "Bitte gib dein Passwort ein.",
          transform: value => value.trim()
        }),
        userID: null,
        loading: false
      }
    },
    head: () => ({
      title: "Anmelden"
    }),
    computed: {
      nextURL() {
        return this.$route.query.to || "/admin"
      }
    },
    async created() {
      if (
        (await this.$axios.get(
          "/api/auth/me",
          { validateStatus: status => [200, 403, 401].includes(status) }
        )).status === 200
      ) await this.$router.replace(this.nextURL)
      else this.show = true
    },
    methods: {
      async submit() {
        this.username.touch()
        this.password.touch()
        if (!(this.username.valid && this.password.valid)) return

        this.loading = true

        const result = await this.$axios.post("/api/auth", {
          id: this.userID,
          password: this.password.transformedValue
        }, {
          validateStatus: status => [204, 401].includes(status)
        })

        if (result.status === 204)
          await this.$router.replace(this.nextURL)
        else {
          this.password.setError("Dein Passwort ist nicht richtig.", true)
          this.username.disabled = false
          this.password.disabled = false
          this.loading = false
        }
      }
    }
  }
</script>
