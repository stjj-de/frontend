export function transformQuillLinks(html) {
  const container = document.createElement("div")
  container.innerHTML = html
  container.querySelectorAll("a").forEach(element => {
    const href = element.getAttribute("href")

    if (!(href.startsWith("https://") || href.startsWith("http://"))) {
      // relative
      element.removeAttribute("target")
      element.removeAttribute("rel")
      element.dataset.routerLink = true
    }
  })

  return container.innerHTML
}
