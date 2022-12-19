import { cacheExchange, createClient, fetchExchange } from "@urql/vue"

export const urqlClient = createClient({
  url: "/api/graphql",
  requestPolicy: "cache-and-network",
  suspense: true,
  exchanges: [
    cacheExchange,
    fetchExchange
  ]
})
