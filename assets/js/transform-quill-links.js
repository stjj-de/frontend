export function transformQuillLinks(html) {
  const container = document.createElement("div")
  container.innerHTML = html
  container.querySelectorAll("a").forEach(element => {
    if (element.getAttribute("href").startsWith("/")) {
      // internal
      element.removeAttribute("target")
      element.removeAttribute("rel")
      element.dataset.routerLink = "true"
    }
  })

  return container.innerHTML
}
