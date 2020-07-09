export default function ({ $axios, redirect }) {
  $axios.onResponseError(error => {
    if (error.response.status === 401) {
      redirect("/login")
    }
  })
}
