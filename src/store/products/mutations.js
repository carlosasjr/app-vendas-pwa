const mutations = {
  SET_LOCAL_ALL_PRODUCTS(state, products) {
    state.localProducts = products;
  },

  ADD_LOCAL_PRODUCTS(state, product) {
    state.localProducts.push(product);
  },
};

export default mutations;
