const getters = {
  localSellers(state) {
    return state.localSellers.map((seller) => {
      return {
        label: seller.name,
        value: seller.id,
      };
    });
  },
};

export default getters;
