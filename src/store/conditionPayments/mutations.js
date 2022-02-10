const mutations = {
  SET_LOCAL_ALL_CONDITION_PAYMENTS(state, conditionPayments) {
    state.localConditionPayments = conditionPayments;
  },

  ADD_LOCAL_CONDITION_PAYMENTS(state, conditionPayment) {
    state.localConditionPayments.push(conditionPayment);
  },
};

export default mutations;
