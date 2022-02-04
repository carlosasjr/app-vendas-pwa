import Vue from "vue";
import Localbase from "localbase";

const db = new Localbase("db");

Vue.prototype.$db = db;

export { db };
