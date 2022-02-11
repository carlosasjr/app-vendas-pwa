import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "clients";

const actions = {
  getApiClientsByCompany({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .get(`${RESOURCE}/all`, { params })
        .then((response) => resolve(response.data.data))
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.errors);
          } else reject(error);
        });
    });
  },

  async getAllLocalClientsByCompany({ commit }, company_id) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("name")
        .get()
        .then((clients) => {
          let clientsCompany = clients.filter((client) => {
            return client.company_id == company_id && client.inative == 0;
          });
          resolve(commit("SET_LOCAL_ALL_CLIENTS", clientsCompany));
        })
        .catch((error) => reject(error));
    });
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
