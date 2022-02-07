import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "clients";

const actions = {
  getApiClientsByCompany({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .get(`${RESOURCE}/all`, { params })
        .then((response) => resolve(response.data.data))
        .catch((error) => reject(error.response.data.errors));
    });
  },

  async getAllLocalClientsByCompany({ commit }, company_id) {
    let clients = await db.collection(`${RESOURCE}`).orderBy("name").get();
    return Promise.all(
      clients.filter(async (client) => {
        return client.company_id == company_id;
      }, commit("SET_LOCAL_ALL_CLIENTS", clients))
    );
  },

  async createUpdateLocalClient({ commit }, clients) {
    return Promise.all(
      clients.map(async (client) => {
        return await db.collection(`${RESOURCE}`).add(client, client.uuid);
      })
    );
  },

  getLocalClientById({ context }, client_id) {
    return db.collection(`${RESOURCE}`).doc({ id: client_id }).get();
  },
};

export default actions;
