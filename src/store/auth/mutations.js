const mutations = {
  SET_AUTHENTICATED(state, status) {
    state.authenticated = status;
  },

  LOGOUT(state) {
    state.authenticated = false;
    state.me = {};
  },

  SET_ME(state, me) {
    state.me = me;
  },
};

export default mutations;
