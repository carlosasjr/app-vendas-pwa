import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "form-payments";

const actions = {
  getApiFormPaymentByCompany({ commit }, params) {
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

  async getAllLocalFormPaymentByCompany({ commit }, company_id) {
    let formPayments = await db
      .collection(`${RESOURCE}`)
      .orderBy("description")
      .get();
    return Promise.all(
      formPayments.filter(async (formPayment) => {
        return formPayment.company_id == company_id;
      }, commit("SET_LOCAL_ALL_FORM_PAYMENTS", formPayments))
    );
  },

  async createUpdateLocalFormPayment({ commit }, formPayments) {
    return Promise.all(
      formPayments.map(async (formPayment) => {
        return await db
          .collection(`${RESOURCE}`)
          .add(formPayment, formPayment.uuid);
      })
    );
  },

  getLocalFormPaymentById({ context }, formPayment_id) {
    return db.collection(`${RESOURCE}`).doc({ id: formPayment_id }).get();
  },
};

export default actions;
