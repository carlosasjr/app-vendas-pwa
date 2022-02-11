import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "products";

const actions = {
  getApiProductsByCompany({ commit }, params) {
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

  async getAllLocalProductsByCompany({ commit }, company_id) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("description")
        .get()
        .then((products) => {
          let productsCompany = products.filter((product) => {
            return product.company_id == company_id && product.inative == 0;
          });
          resolve(commit("SET_LOCAL_ALL_PRODUCTS", productsCompany));
        })
        .catch((error) => reject(error));
    });
  },

  async createUpdateLocalProduct({ commit }, products) {
    return Promise.all(
      products.map(async (product) => {
        return await db.collection(`${RESOURCE}`).add(product, product.uuid);
      })
    );
  },

  getLocalProductById({ context }, product_id) {
    return db.collection(`${RESOURCE}`).doc({ id: product_id }).get();
  },
};

export default actions;
