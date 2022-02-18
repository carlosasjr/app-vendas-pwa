import { api } from "src/boot/axios";
import { db } from "src/boot/database";
import { status } from "src/boot/constants";

const RESOURCE = "sales";

const actions = {
  getAllLocalSalesByCompany({ commit }, params) {
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

  getAllLocalSalesFinish({ commit }, params) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("created_at", "desc")
        .get()
        .then((sales) => {
          let salesCompany = sales.filter((sale) => {
            return (
              sale.company_id == params.company_id &&
              sale.seller_id == params.seller_id &&
              sale.status == status.FINISH
            );
          });

          resolve(salesCompany);
        })

        .catch((error) => reject(error));
    });
  },

  getAllLocalSalesFinishLater({ commit }, params) {
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("created_at", "desc")
        .get()
        .then((sales) => {
          let salesCompany = sales.filter((sale) => {
            return (
              sale.company_id == params.company_id &&
              sale.seller_id == params.seller_id &&
              sale.status == status.FINISH_LATER
            );
          });

          resolve(salesCompany);
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

  async updateLocalSaleIntegrated({ context }, uuid) {
    return await db.collection(`${RESOURCE}`).doc({ uuid: uuid }).update({
      status: status.INTEGRATED,
    });
  },

  async updateLocalSaleProcessed({ context }, sale) {
    return await db.collection(`${RESOURCE}`).doc({ uuid: sale.uuid }).update({
      status: status.PROCESSED,
      code_erp: sale.code_erp,
    });
  },

  getApiAllProcessedByCompany({ context }, params) {
    return new Promise((resolve, reject) => {
      api
        .get(`${RESOURCE}/all-processed?`, { params })
        .then((response) => resolve(response.data.data))
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.errors);
          } else reject(error);
        });
    });
  },

  createApiSale({ commit }, sale) {
    return new Promise((resolve, reject) => {
      api
        .post(`${RESOURCE}`, sale)
        .then((response) => resolve(response.data))
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.errors);
          } else reject(error);
        });
    });
  },
};

export default actions;
