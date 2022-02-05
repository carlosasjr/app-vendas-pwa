import { api } from "src/boot/axios";

const RESOURCE = "devices";

const actions = {
  createApiDevice({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .post(`${RESOURCE}`, params)
        .then((response) => resolve(response.data.data))
        .catch((error) => reject(error.response.data.errors));
    });
  },
};

export default actions;
