import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "sellers";

const actions = {
  getApiSellersByCompany({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .get(`${RESOURCE}/all`, { params })
        .then((response) => resolve(response.data.data))
        .catch((error) => reject(error.response.data.errors));
    });
  },

  getAllLocalSellersByCompany({ commit }, company_id) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .get()
        .then((sellers) => {
          let sellersCompany = sellers.filter((seller) => {
            return seller.company_id == company_id;
          });
          resolve(commit("SET_LOCAL_ALL_SELLERS", sellersCompany));
        })
        .catch((error) => reject(error));
    });
  },

  createLocalSellers({ commit }, sellers) {
    sellers.map((seller) => {
      db.collection(`${RESOURCE}`).add(seller);
    });
  },

  getLocalSellerById({ context }, seller_id) {
    return db.collection(`${RESOURCE}`).doc({ id: seller_id }).get();
  },
};

export default actions;
