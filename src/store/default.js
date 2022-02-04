export const state = {
  preloader: false,
  textPreloader: ''
}

export const getters = {
  preloader (state) {
    return state.preloader
  },

  textPreloader (state) {
    return state.textPreloader
  }
}

export const mutations = {
  SET_PRELOADER (state, status) {
    state.textPreloader = ''
    state.preloader = status
  },

  SET_TEXT_PRELOADER (state, text) {
    state.textPreloader = text
  },
}
