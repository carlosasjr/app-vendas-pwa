const mutations = {
  START_CART(state, params) {
    state.cart.uuid = params.uuid;
    state.cart.company_id = params.company_id;
    state.cart.client_id = params.client_id;
    state.cart.client = params.client;
    state.cart.seller_id = params.seller_id;
    state.cart.status = params.status;
    state.cart.created_at = params.created_at;
  },

  SHOW_CART(state, sale) {
    state.cart = sale;
  },

  ADD_ITEMS_CART(state, item) {
    state.cart.items.push(item);
  },

  REMOVE_PRODUCT_CART(state, item) {
    state.cart.items = state.cart.items.filter((productCart) => {
      return productCart.product.id !== item.product.id;
    });
  },

  ADD_FORMS_CART(state, form) {
    state.cart.payments.push(form);
  },

  REMOVE_FORM_CART(state, item) {
    state.cart.payments = state.cart.payments.filter((form) => {
      return form.formPayment_id !== item.formPayment_id;
    });
  },

  CLEAR_CART(state) {
    state.cart.uuid = "";
    state.cart.company_id = "";
    state.cart.seller_id = "";
    state.cart.client = "";
    state.cart.status = "";
    state.cart.items = [];
    state.cart.payments = [];
    state.cart.created_at = "";
  },
};

export default mutations;
