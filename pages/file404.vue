<template>
  <div></div>
</template>

<script>
  export default {
    name: "File404Page",
    asyncData({ route, error: showError }) {
      const error = new Error("Fake error for showing the 404 page")
      error.isPageNotFound = true
      error.m = "Diese Datei existiert nicht."

      let path = "/files/"
      if (route.query.id) path += route.query.id
      else {
        if (route.query.invalid === "false") {
          error.m = "Diese Datei ist gerade nicht verfügbar."
          error.isPageNotFound = false
        }

        path += `from-content/${route.query.content}`
      }

      error.fakePath = path
      showError(error)
    }
  }
</script>
