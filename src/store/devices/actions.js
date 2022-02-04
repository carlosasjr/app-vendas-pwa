import { api } from "src/boot/axios";

const RESOURCE = "devices";

const actions = {
  createDevice({ commit }, params) {
    return new Promise((resolve, reject) => {
      console.log("api device", params);
      api
        .post(`${RESOURCE}`, params)
        .then((response) => resolve(response.data.data))
        .catch((error) => reject(error.response.data.errors));
    });
  },
};

export default actions;
