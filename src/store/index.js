import Vue from "vue";
import Vuex from "vuex";
import { state, mutations, getters } from "./default";

import company from "./company";
import devices from "./devices";
import sellers from "./sellers";
import clients from "./clients";
import products from "./products";
import formPayments from "./formPayments";
import conditionPayments from "./conditionPayments";
import cart from "./cart";
import sales from "./sales";
import auth from "./auth";

Vue.use(Vuex);

Vue.component("preloader", () => import("../components/Preloader"));

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      company,
      devices,
      sellers,
      clients,
      products,
      formPayments,
      conditionPayments,
      cart,
      sales,
    },

    state,
    mutations,
    getters,

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING,
  });

  return Store;
}
