import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "sellers";

const actions = {
  getApiSellersByCompany({ commit }, params) {
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

  getAllLocalSellersByCompany({ commit }, company_id) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("name")
        .get()
        .then((sellers) => {
          let sellersCompany = sellers.filter((seller) => {
            return seller.company_id == company_id && seller.inative == 0;
          });
          resolve(commit("SET_LOCAL_ALL_SELLERS", sellersCompany));
        })
        .catch((error) => reject(error));
    });
  },

  createUpdateLocalSellers({ commit }, sellers) {
    return Promise.all(
      sellers.map(async (seller) => {
        return await db.collection(`${RESOURCE}`).add(seller, seller.uuid);
      })
    );
  },

  getLocalSellerById({ context }, seller_id) {
    return db.collection(`${RESOURCE}`).doc({ id: seller_id }).get();
  },
};

export default actions;
