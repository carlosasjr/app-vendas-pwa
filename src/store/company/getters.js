const getters = {
  localCompanies(state) {
    return state.localCompanies.map((company) => {
      return {
        label: company.data.name,
        value: company.data.id,
      };
    });
  },
};

export default getters;
