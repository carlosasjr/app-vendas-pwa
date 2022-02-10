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
    let products = await db
      .collection(`${RESOURCE}`)
      .orderBy("description")
      .get();
    return Promise.all(
      products.filter(async (product) => {
        return product.company_id == company_id;
      }, commit("SET_LOCAL_ALL_PRODUCTS", products))
    );
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
