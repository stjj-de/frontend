module.exports = {
  mode: "universal",
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: "%s - Katholische Kirchengemeinde St. Josef - St. Johannes",
    title: "Start",
    html: { lang: "de" },
    script: [
      { src: "/hey.js", defer: true, async: true }
    ],
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: process.env.npm_package_description || "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sen:wght@400;600&display=swap"
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#000000" },
  /*
  ** Global CSS
  */
  css: [
    "@/assets/styles/global.scss"
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "@/plugins/vue-ripple-directive"
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module"
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    "svg-to-vue-component/nuxt"
  ],
  /*
  ** Build configuration
  */
  build: {
    parallel: true,
    transpile: ["vue-ripple-directive"],
    /*
    ** You can extend webpack config here
    */
    // eslint-disable-next-line no-unused-vars
    extend(config, context) {
    }
  }
};
