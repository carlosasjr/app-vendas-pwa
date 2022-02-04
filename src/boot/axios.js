import Vue from "vue";
import axios from "axios";

Vue.prototype.$axios = axios;

const api = axios.create({
  baseURL: process.env.API,
});

Vue.prototype.$api = api;

export { axios, api };
