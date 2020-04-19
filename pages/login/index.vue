<template>
  <div class="login-page" :data-logged-in="loggedIn">
    <div class="content _box-container">
      <main class="_box" :data-show="showBox">
        <LoadingOverlay :active="loggedIn" :transition-delay="150">
          Du wirst angemeldet
        </LoadingOverlay>
        <div class="_box-content">
          <nuxt-link class="_back link" to="/">
            <ArrowLeftIcon class="_back-arrow"/>
            Zurück zur Startseite
          </nuxt-link>
          <h1 class="heading--3 _heading">
            Anmelden
          </h1>
          <form class="_form" action="javascript:" @submit="submit()">
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
            <div class="_buttons">
              <MyButton
                class="_next-step"
                is-submit
                variant="primary"
                :loading="submitLoading"
                :disabled="!(password.valid && username.valid)"
              >
                Anmelden
              </MyButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login-page {
    height: 100vh;

    background: #025ded;
    background: linear-gradient(203deg, #3895ed 0%, #7700c6 100%);
    background-size: 100% 200%;

    background-position: 0 100%;
    transition: 2s ease background-position;

    &[data-logged-in] {
      background-position: 0 0;

      ._box-content {
        opacity: 0;
      }
    }
  }

  ._box-content {
    transition: 300ms ease opacity;
  }

  ._heading {
    margin-bottom: 0;
  }

  ._back {
    font-size: 1.2rem;
    top: 10px;
    left: 10px;
  }

  ._back-arrow {
    width: 20px;
    position: relative;
    top: 3px;
  }

  ._box-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  ._box {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 10px 100px 20px rgba(0, 0, 0, 0.4);

    width: 400px;
    padding: 40px;
    overflow: hidden;

    position: relative;

    opacity: 0;
    transition: 200ms ease opacity;
    &[data-show] {
      opacity: 1;
    }
  }

  ._buttons {
    display: flex;
    justify-content: flex-end;

    & > *:not(:last-child) {
      margin-right: 5px;
    }
  }
</style>

<script>
  import UserQuery from "./userQuery.graphql";
  import GetOrCreateAuthenticationTokenMutation from "./getOrCreateAuthenticationTokenMutation.graphql";
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
  import InputField from "@/components/InputField/InputField";
  import { InputFieldCompanion } from "@/components/InputField/InputFieldCompanion";
  import { isLoggedIn } from "@/assets/js/isLoggedIn";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import MyButton from "@/components/MyButton";

  export default {
    name: "LoginPage",
    layout: "only-app",
    components: { MyButton, LoadingOverlay, InputField, ArrowLeftIcon },
    head: () => ({
      title: "Anmelden"
    }),
    created() {
      if (isLoggedIn(this)) {
        this.$router.replace(this.nextURL);
      } else {
        this.showBox = true;
      }
    },
    data() {
      return {
        showBox: false,
        username: new InputFieldCompanion({
          defaultValue: "",
          transform: value => value.trim(),
          required: "Bitte gib deinen Benutzernamen ein.",
          validate: value => {
            if (value.includes(" ")) {
              return "Benutzernamen enthalten keine Leerzeichen.";
            }
          },
          validateOrSaveAsync: async value => {
            const { data } = await this.$apollo.query({
              query: UserQuery,
              variables: {
                username: value
              }
            });

            if (data.user === null) {
              return "Dieser Benutzername ist ungültig.";
            }

            this.userID = data.user.id;
          }
        }),
        password: new InputFieldCompanion({
          defaultValue: "",
          type: "password",
          required: "Bitte gib dein Passwort ein.",
          transform: value => value.trim()
        }),
        userID: 2,
        submitLoading: false,
        loggedIn: false
      };
    },
    computed: {
      nextURL() {
        return this.$route.query.to || "/admin";
      }
    },
    methods: {
      async submit() {
        this.username.touch();
        this.password.touch();
        if (!(this.username.valid && this.password.valid)) return;

        this.username.disabled = true;
        this.password.disabled = true;

        this.submitLoading = true;
        const result = await this.$apollo.mutate({
          mutation: GetOrCreateAuthenticationTokenMutation,
          variables: {
            id: this.userID,
            password: this.password.value
          },
          errorPolicy: "all"
        });

        if (result.errors) {
          const { code } = result.errors[0].extensions;

          this.username.disabled = false;
          this.password.disabled = false;
          this.submitLoading = false;

          if (code === "INVALID_PASSWORD") {
            this.password.setError("Dein Passwort ist nicht richtig.", true);
          } else if (code === "INVALID_ID") {
            this.username.setError("Dieser Benutzername ist ungültig.", true);
          } else {
            throw new Error("Unexpected Apollo error: " + result.errors[0].message);
          }

          return;
        }

        const { token } = result.data.getOrCreateAuthenticationToken;
        await this.$apolloHelpers.onLogin(token);

        this.loggedIn = true;

        setTimeout(() => {
          this.$router.push(this.nextURL);
        }, 2000);
      }
    }
  };
</script>
