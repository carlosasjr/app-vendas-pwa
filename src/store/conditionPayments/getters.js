const getters = {
  localConditionPayments(state) {
    return state.localConditionPayments.map((form) => {
      return {
        label: form.description,
        value: form.id,
      };
    });
  },
};

export default getters;
