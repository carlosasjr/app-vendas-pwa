const mutations = {
  SET_LOCAL_ALL_SELLERS(state, sellers) {
    state.localSellers = sellers;
  },

  ADD_LOCAL_SELLER(state, seller) {
    state.localSellers.push(seller);
  },
};

export default mutations;
