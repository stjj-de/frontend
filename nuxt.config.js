const isServerRun = Boolean(process.env.IS_SERVER_RUN);

if (!isServerRun) {
  require("dotenv").config();
}

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  mode: "universal",
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: "%s - Katholische Kirchengemeinde St. Josef - St. Johannes",
    title: "Start",
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
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
    "kiste/nuxt"
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    "@nuxtjs/apollo"
  ],

  kiste: {
    theme: {
      contentPadding: "10px",
      colors: {
        blue: "#0054f1/black/#3695d8"
      }
    },
    navigationItems: [
      {
        label: "Start",
        to: "/"
      },
      {
        label: "Gruppierungen",
        to: "/gruppierungen"
      },
      {
        label: "Mediathek",
        to: "/mediathek"
      }
    ],
    footerItems: [
      {
        label: "Impressum",
        to: "/impressum"
      },
      {
        label: "Datenschutzerklärung",
        to: "/datenschutzerklaerung"
      }
    ]
  },

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
        httpEndpoint: `http://127.0.0.1:${process.env.PORT}/graphql`,
        // optional
        // override HTTP endpoint in browser only
        browserHttpEndpoint: "/graphql",
        // optional
        // See https://www.apollographql.com/docs/link/links/http.html#options
        httpLinkOptions: {
          credentials: "same-origin"
        },
        // You can use `wss` for secure connection (recommended in production)
        // Use `null` to disable subscriptions
        wsEndpoint: isDevelopment
          ? `ws://127.0.0.1:${process.env.PORT}/graphql`
          : `wss://${process.env.PUBLIC_HOST}/graphql`,
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
    /*
    ** You can extend webpack config here
    */
    // eslint-disable-next-line no-unused-vars
    extend(config, context) {
    }
  }
};
