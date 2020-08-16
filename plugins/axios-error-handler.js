// eslint-disable-next-line func-names
export default function({ $axios, redirect }) {
  $axios.onResponseError(error => {
    if (error.response && error.response.status === 401)
      redirect("/login")
  })
}
