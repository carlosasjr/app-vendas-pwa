const mutations = {
  SET_LOCAL_ALL_FORM_PAYMENTS(state, formPayments) {
    state.localFormPayments = formPayments;
  },

  ADD_LOCAL_FORM_PAYMENTS(state, formPayment) {
    state.localFormPayments.push(formPayment);
  },
};

export default mutations;
