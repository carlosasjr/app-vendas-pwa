const getters = {
  localFormPayments(state) {
    return state.localFormPayments.map((form) => {
      return {
        label: form.description,
        value: form.id,
      };
    });
  },
};

export default getters;
