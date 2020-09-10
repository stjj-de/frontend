const isDevelopment = process.env.NODE_ENV === "development"
if (isDevelopment) process.env.IS_DEV_ENV = "true"
const isDevelopmentEnvironment = process.env.IS_DEV_ENV === "true"

const META_DESCRIPTION = "Die Webseite der Katholischen Kirchengemeinde St. Josef - St. Johannes."

const config = {
  server: {
    host: "0.0.0.0"
  },
  mode: isDevelopment ? "spa" : "universal",
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: "%s - Katholische Kirchengemeinde St. Josef - St. Johannes.",
    title: "Start",
    htmlAttrs: { lang: "de" },
    script: [
      { src: "/hey.js", defer: true, async: true }
    ],
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: META_DESCRIPTION
      },
      {
        hid: "og:description",
        name: "og:description",
        content: META_DESCRIPTION
      },
      { hid: "og:image", name: "og:image", content: "/og-image.png" },
      { hid: "og:site_name", name: "og:site_name", content: "Katholische Kirchengemeinde St. Josef - St. Johannes" },
      { hid: "og:locale", name: "og:locale", content: "de_DE" }
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sen:wght@400;600&display=swap"
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: "#000000",
    height: "5px"
  },
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
    "@/plugins/vue-ripple-directive",
    "@/plugins/axios-error-handler",
    "@/plugins/api",
    { src: "@/plugins/vue-flash-message", mode: "client" }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    "@nuxtjs/eslint-module"
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    "svg-to-vue-component/nuxt",
    "@nuxtjs/axios",
    "@nuxtjs/pwa"
  ],
  pwa: {
    meta: false,
    manifest: false,
    workbox: false
  },
  axios: {
    baseURL: isDevelopmentEnvironment ? "http://127.0.0.1:8000" : `http://${process.env.SSR_BACKEND_HOST}`,
    browserBaseURL: "/",
    progress: false
  },
  /*
  ** Build configuration
  */
  build: {
    parallel: true,
    transpile: ["vue-ripple-directive"],
    /*
    ** You can extend webpack config here
    */
    // eslint-disable-next-line no-unused-vars,no-empty-function
    extend(cfg, context) {
    }
  }
}

// This should be done by Nginx in production
if (isDevelopmentEnvironment) {
  config.modules.push("@nuxtjs/proxy")
  config.proxy = ["http://localhost:8000/files", "http://localhost:8000/api"]
} else {
  config.buildModules.push("nuxt-ackee")
  config.ackee = {
    // TODO: Change to data for stjj.de
    server: "https://analytics.stjj.moritzruth.de",
    domainId: "9c4b4250-5486-4fc9-be83-d7e3317c2f30",
    detailed: false
  }
}

module.exports = config
