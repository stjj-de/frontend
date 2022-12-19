import authenticatedUserQuery from "@/gql/authenticatedUser.graphql"
import { ref } from "vue"
import { urqlClient } from "./urql"

export interface AuthenticatedUser {
  id: string
  username: string
  firstName: string
  isAdmin: boolean
}

export const authenticatedUser = ref<AuthenticatedUser | null>(null)

let isLoading = false
export function fetchAuthenticatedUser(force: boolean = false) {
  if (isLoading && !force) return
  isLoading = true

  urqlClient.query(authenticatedUserQuery).toPromise().then(({ data }) => {
    isLoading = false
    authenticatedUser.value = data.authenticatedItem
  }).catch(console.error)
}
