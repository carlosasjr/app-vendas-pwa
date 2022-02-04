import Vue from "vue";
import Vuex from "vuex";
import { state, mutations, getters } from "./default";

// import example from './module-example'
import company from "./company";
import devices from "./devices";
import auth from "./auth";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
Vue.component("preloader", () => import("../components/Preloader"));

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      company,
      devices,
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
