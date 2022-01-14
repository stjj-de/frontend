export const getFormattedTitle = (title: string) => `${title} | Katholische Kirchengemeinde St. Josef — St. Johannes`

const devBaseUrl = new URL(location.href)
devBaseUrl.pathname = ""
devBaseUrl.port = "1337"

const strapiBaseUrl = (import.meta.env.DEV ? devBaseUrl.toString() : "https://noir.stjj.de/").slice(0, -1)
export const getStrapiUrl = (path: string) => strapiBaseUrl + path
