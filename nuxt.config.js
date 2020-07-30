const BACKEND_PORT = 8000;
const isDevelopment = process.env.NODE_ENV === "development";
const useProxyAndNoTLS = isDevelopment  || process.env.USE_PROXY_AND_NO_TLS === "true";

const config = {
  server: {
    host: "0.0.0.0"
  },
  mode: isDevelopment ? "spa" : "universal",
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
      { hid: "description", name: "description", content: "" }
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
    "@/plugins/api"
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    "svg-to-vue-component/nuxt",
    "@nuxtjs/axios"
  ],
  axios: {
    baseURL: `${useProxyAndNoTLS ? "http" : "https"}://127.0.0.1:${BACKEND_PORT}`,
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
    // eslint-disable-next-line no-unused-vars
    extend(config, context) {
    }
  }
};

// This should be done by Nginx in production
if (useProxyAndNoTLS) {
  config.modules.push("@nuxtjs/proxy");
  config.proxy = ["http://localhost:8000/files", "http://localhost:8000/api"];
}

module.exports = config;
