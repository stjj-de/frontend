<template>
  <div class="flex items-center justify-center">
    <form class="w-80 flex flex-col gap-3" @submit.prevent="onSubmit">
      <h1 class="font-bold text-2xl pb-1">Anmelden</h1>
      <div class="p-4 mb-1 border-1 border-red-600" :class="{ 'hidden': !isFailed }">
        Diese Kombination aus Benutzername und Passwort ist ungültig.
      </div>
      <TextField v-model="username" label="Benutzername"/>
      <TextField v-model="password" label="Passwort"/>
      <SButton class="self-end" t="secondary" is-submit :is-loading="isLoading" @click="onSubmit">Anmelden</SButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useMutation } from "@urql/vue"
import AuthenticateMutation from "@/gql/pages/login_authenticate.graphql"
import { computed, ref } from "vue"
import TextField from "@/components/TextField.vue"
import SButton from "@/components/SButton.vue"
import { useRouter } from "vue-router"
import { authenticatedUser, fetchAuthenticatedUser } from "@/auth"
import { whenever } from "@vueuse/core"

const username = ref("")
const password = ref("")

const { executeMutation: login, data } = useMutation(AuthenticateMutation)

const isFailed = computed(() => data.value?.authenticateUserWithPassword?.__typename === "UserAuthenticationWithPasswordFailure")
const isLoading = ref(false)

const router = useRouter()

whenever(authenticatedUser, async () => {
  isLoading.value = true
  await redirect()
}, { immediate: true })

async function onSubmit() {
  isLoading.value = true
  await login({
    username: username.value,
    password: password.value
  })

  if (isFailed.value) isLoading.value = false
  else fetchAuthenticatedUser(true)
}

async function redirect() {
  const next = router.currentRoute.value.query.next as (string | undefined)

  if (next === undefined) await router.replace("/")
  else await router.replace(decodeURI(next))
}
</script>
