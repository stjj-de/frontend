export const state = () => ({
  userID: null
});

export const mutations = {
  setUserID(state, userID) {
    state.userID = userID;
  }
};
