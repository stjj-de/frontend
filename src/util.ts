export const getFormattedTitle = (title: string) => `${title} • Katholische Kirchengemeinde St. Josef — St. Johannes`

const devBaseUrl = new URL(location.href)
devBaseUrl.pathname = ""
devBaseUrl.port = "8000"

const keystoneBaseUrl = (import.meta.env.DEV ? devBaseUrl.toString() : "https://stone.stjj.de/").slice(0, -1)
export const getBackendUrl = (path: string) => keystoneBaseUrl + path
