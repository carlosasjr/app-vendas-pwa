const mutations = {
  SET_AUTHENTICATED(state, me) {
    state.me = me;
    state.authenticated = true;

    window.localStorage.setItem('auth', JSON.stringify(state.me))
  },

  LOGOUT(state) {
    state.authenticated = false;
    state.me = {};
    localStorage.removeItem('auth');
  },

  CHANGE_URL_BACK (state, url) {
    state.url_back = url
  }
};

export default mutations;
