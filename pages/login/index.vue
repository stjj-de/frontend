<template>
  <div class="login-page" :data-logged-in="loggedIn">
    <div class="content _box-container">
      <main class="_box" :data-show="showBox">
        <nuxt-link class="_back link" to="/">
          <ArrowLeftIcon class="_back-arrow"/>
          Zurück zur Startseite
        </nuxt-link>
        <div class="_heading-container">
          <h1 class="heading--3 _heading" :data-visible="!loggedIn">
            Anmelden
          </h1>
          <h1 class="heading--3 _heading _welcome" :data-visible="loggedIn">
            Willkommen
          </h1>
        </div>
        <form class="_form" action="javascript:" @submit="submit()">
          <InputField
            label="Benutzername"
            autocomplete="username"
            disable-spellcheck
            :companion="username"
          />
          <InputField
            label="Passwort"
            autocomplete="current-password"
            :companion="password"
          />
          <div class="_buttons">
            <KButton
              class="_next-step"
              is-submit
              :loading="submitLoading"
              :disabled="!(password.valid && username.valid)"
            >
              Anmelden
            </KButton>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login-page {
    height: 100vh;

    background: #025ded;
    background: linear-gradient(203deg, #3895ed 10%, #7700c6 90%);
    background-size: 100% 200%;

    background-position: 0 100%;
    transition: 1s ease background-position;

    &[data-logged-in] {
      background-position: 0 0;

      ._back {
        opacity: 0;
      }

      ._form {
        opacity: 0;
      }
    }
  }

  ._heading-container {
    position: relative;
    height: 70px;
  }

  $logged-in-transition: 300ms ease opacity;

  ._heading {
    margin-bottom: 0;

    position: absolute;
    top: 0;

    opacity: 0;
    transition: $logged-in-transition;

    &[data-visible] {
      opacity: 1;
    }
  }

  ._welcome {
    text-align: center;
    display: block;
    left: 50%;
    transform: translateX(-50%);
  }

  ._back {
    font-size: 1.2rem;
    top: 10px;
    left: 10px;

    opacity: 1;
    transition: $logged-in-transition;
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

    opacity: 0;
    transition: 200ms ease opacity;
    &[data-show] {
      opacity: 1;
    }
  }

  ._form {
    opacity: 1;
    transition: $logged-in-transition;
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
  import KButton from "kiste/components/KButton";
  import UserQuery from "./userQuery.graphql";
  import GetOrCreateAuthenticationTokenMutation from "./getOrCreateAuthenticationTokenMutation.graphql";
  import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
  import InputField from "@/components/InputField";
  import { InputFieldCompanion } from "@/assets/InputFieldCompanion";

  export default {
    name: "LoginPage",
    layout: "only-app",
    components: { InputField, ArrowLeftIcon, KButton },
    head: () => ({
      title: "Anmelden"
    }),
    created() {
      if (this.$apolloHelpers.getToken() === undefined) {
        this.showBox = true;
      } else {
        this.$router.push(this.nextURL);
      }
    },
    data() {
      return {
        showBox: false,
        username: new InputFieldCompanion({
          keepShowingState: true,
          defaultValue: "",
          transform: value => value.trim(),
          validate: value => {
            if (value === "") {
              return "Bitte gib deinen Benutzernamen ein.";
            } else if (value.includes(" ")) {
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
          transform: value => value.trim(),
          validate: value => {
            if (value === "") {
              return "Bitte gib dein Passwort ein.";
            }
          }
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
