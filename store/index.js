/* eslint-disable no-shadow */
export const state = () => ({
  userID: null,
  user: null,
  userPromise: null
})

export const mutations = {
  setUserID(state, userID) {
    state.userID = userID
  },
  setUser(state, user) {
    state.user = user
  },
  setUserPromise(state, userPromise) {
    state.userPromise = userPromise
  }
}

export const getters = {
  userIsEditor(state) {
    if (state.user === null) return false
    return state.user.role !== "NONE"
  }
}
