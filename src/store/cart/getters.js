import { status } from "src/boot/constants";

const getters = {
  cart(state) {
    return state.cart;
  },

  hasCart(state) {
    return (
      state.cart.status == status.OPEN ||
      state.cart.status == status.FINISH_LATER
    );
  },
};

export default getters;
