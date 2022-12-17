/// <reference types="vite-plugin-pages/client"/>
/// <reference types="unplugin-icons/types/vue"/>
/// <reference types="vite/client"/>
/// <reference types="@types/umami"/>

declare module "*.graphql" {
  import { DocumentNode } from "graphql"

  const Schema: DocumentNode

  export = Schema
}
