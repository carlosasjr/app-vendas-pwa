import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "companies";

const actions = {
  getCompanyByCnpj({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .get(`${RESOURCE}`, { params })
        .then((response) => resolve(response.data.data))
        .catch((error) => reject(error.response.data.errors));
    });
  },

  getLocalCompanies({ commit }) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .get({ keys: true })

        .then((companies) =>
          resolve(commit("SET_LOCAL_ALL_COMPANIES", companies))
        )
        .catch((error) => reject(error));
    });
  },
};

export default actions;
