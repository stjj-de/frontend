const isServerRun = Boolean(process.env.IS_SERVER_RUN);

if (!isServerRun) {
  require("dotenv").config();
}

const usesSSL = process.env.USES_SSL === "true";
const publicHostAndPort = process.env.PUBLIC_HOST + ":" + process.env.PUBLIC_PORT;

module.exports = {
  mode: "universal",
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: "%s - Katholische Kirchengemeinde St. Josef - Johannes",
    title: "Start",
    html: { lang: "de" },
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
  loading: { color: "#fff" },
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
    "svg-to-vue-component/nuxt",
    "@nuxtjs/apollo"
  ],

  apollo: {
    cookieAttributes: {
      /**
       * Define when the cookie will be removed. Value can be a Number
       * which will be interpreted as days from time of creation or a
       * Date instance. If omitted, the cookie becomes a session cookie.
       */
      expires: 30 // optional, default: 7 (days)
    },
    clientConfigs: {
      default: {
        // Only for SSR
        httpEndpoint: `http://127.0.0.1:${process.env.PORT}/graphql`,
        // Only for browser
        browserHttpEndpoint: `http${usesSSL ? "s" : ""}://${publicHostAndPort}/graphql`,
        // See https://www.apollographql.com/docs/link/links/http.html#options
        httpLinkOptions: {
          credentials: "same-origin"
        },
        // Use `null` to disable subscriptions
        wsEndpoint: `ws${usesSSL ? "s" : ""}://${publicHostAndPort}/graphql`,
        // LocalStorage token
        tokenName: "apollo-token", // optional
        // Enable Automatic Query persisting with Apollo Engine
        persisting: false, // Optional
        // Use websockets for everything (no HTTP)
        // You need to pass a `wsEndpoint` for this to work
        websocketsOnly: false // Optional
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    parallel: false,
    transpile: ["vue-ripple-directive"],
    /*
    ** You can extend webpack config here
    */
    // eslint-disable-next-line no-unused-vars
    extend(config, context) {
    }
  }
};
