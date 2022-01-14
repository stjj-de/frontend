/// <reference types="vite-plugin-pages/client.d.ts"/>
/// <reference types="unplugin-icons/types/vue"/>
/// <reference types="vite/client.d.ts"/>

declare module "*.graphql" {
  import { DocumentNode } from "graphql"

  const Schema: DocumentNode

  export = Schema
}
