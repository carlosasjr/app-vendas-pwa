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
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("description")
        .get()
        .then((formsPayments) => {
          let formsPaymentCompany = formsPayments.filter((form) => {
            return form.company_id == company_id && form.inative == 0;
          });
          resolve(commit("SET_LOCAL_ALL_FORM_PAYMENTS", formsPaymentCompany));
        })
        .catch((error) => reject(error));
    });
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
