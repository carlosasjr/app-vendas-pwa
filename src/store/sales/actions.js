import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "sales";

const actions = {
  getAllLocalSalesByCompany({ commit }, params) {
    console.log(params.company_id, params.seller_id);
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("created_at", "desc")
        .get()
        .then((sales) => {
          let salesCompany = sales.filter((sale) => {
            return (
              sale.company_id == params.company_id &&
              sale.seller_id == params.seller_id
            );
          });
          resolve(commit("SET_LOCAL_ALL_SALES", salesCompany));
        })
        .catch((error) => reject(error));
    });
  },

  getAllLocalSalesByStatus({ commit }, params) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("created_at", "desc")
        .get()
        .then((sales) => {
          let salesCompany = sales.filter((sale) => {
            return (
              sale.company_id == params.company_id &&
              sale.seller_id == params.seller_id &&
              sale.status == params.status
            );
          });
          resolve(commit("SET_LOCAL_ALL_SALES", salesCompany));
        })
        .catch((error) => reject(error));
    });
  },

  async createUpdateLocalSale({ commit }, sale) {
    return await db.collection(`${RESOURCE}`).add(sale, sale.uuid);
  },

  async getLocalSaleByUuid({ context }, uuid) {
    return await db.collection(`${RESOURCE}`).doc({ uuid: uuid }).get();
  },

  async deleteLocalSale({ context }, uuid) {
    return await db.collection(`${RESOURCE}`).doc({ uuid: uuid }).delete();
  },
};

export default actions;
