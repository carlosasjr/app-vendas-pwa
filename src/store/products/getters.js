const getters = {
  localProducts(state) {
    return state.localProducts;
  },

  localProductSelect(state) {
    return state.localProducts.map(product => {
      return {
        label: product.description,
        value: product,

       };
    })
  }
};

export default getters;
