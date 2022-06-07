import { defineConfig, splitVendorChunkPlugin } from "vite"
import vuePlugin from "@vitejs/plugin-vue"
import windicssPlugin from "vite-plugin-windicss"
import pagesPlugin from "vite-plugin-pages"
import iconsPlugin from "unplugin-icons/vite"
import graphqlPlugin from "@rollup/plugin-graphql"

export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    vuePlugin(),
    pagesPlugin({
      syncIndex: false
    }),
    windicssPlugin(),
    iconsPlugin(),
    graphqlPlugin()
  ]
})
