const mutations = {
  SET_LOCAL_ALL_CLIENTS(state, clients) {
    state.localClients = clients;
  },

  ADD_LOCAL_CLIENTS(state, client) {
    state.localClients.push(client);
  },
};

export default mutations;
