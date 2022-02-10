import { api } from "src/boot/axios";
import { db } from "src/boot/database";

const RESOURCE = "condition-payments";

const actions = {
  getApiConditionPaymentByCompany({ commit }, params) {
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

  async getAllLocalConditionPaymentByCompany({ commit }, company_id) {
    let conditionPayments = await db
      .collection(`${RESOURCE}`)
      .orderBy("description")
      .get();
    return Promise.all(
      conditionPayments.filter(async (conditionPayment) => {
        return conditionPayment.company_id == company_id;
      }, commit("SET_LOCAL_ALL_CONDITION_PAYMENTS", conditionPayments))
    );
  },

  async createUpdateLocalConditionPayment({ commit }, conditionPayments) {
    return Promise.all(
      conditionPayments.map(async (conditionPayment) => {
        return await db
          .collection(`${RESOURCE}`)
          .add(conditionPayment, conditionPayment.uuid);
      })
    );
  },

  getLocalConditionPaymentById({ context }, conditionPayment_id) {
    return db.collection(`${RESOURCE}`).doc({ id: conditionPayment_id }).get();
  },
};

export default actions;
