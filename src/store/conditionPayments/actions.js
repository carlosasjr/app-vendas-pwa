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
    return new Promise((resolve, reject) => {
      db.collection(`${RESOURCE}`)
        .orderBy("description")
        .get()
        .then((conditions) => {
          let conditionsCompany = conditions.filter((condition) => {
            return condition.company_id == company_id && condition.inative == 0;
          });
          resolve(
            commit("SET_LOCAL_ALL_CONDITION_PAYMENTS", conditionsCompany)
          );
        })
        .catch((error) => reject(error));
    });
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
