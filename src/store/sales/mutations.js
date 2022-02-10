const mutations = {
  SET_LOCAL_ALL_SALES(state, salers) {
    state.localSales = salers;
  },

  ADD_LOCAL_SELLER(state, saler) {
    state.localSales.push(saler);
  },
};

export default mutations;
