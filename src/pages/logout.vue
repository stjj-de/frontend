<template>
  <div>Du wirst abgemeldet…</div>
</template>

<script setup lang="ts">
import { authenticatedUser } from "@/auth"
import endSessionMutation from "@/gql/pages/logout_endSession.graphql"
import { useMutation } from "@urql/vue"
import { useRouter } from "vue-router"

const router = useRouter()

const { executeMutation } = useMutation(endSessionMutation)
await executeMutation({})

authenticatedUser.value = null
await router.replace("/")
</script>
