import Vue from "vue";

const formatPrice = (val) =>
  parseFloat(val).toLocaleString("pt-br", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDateBr = (currentDate) => {
  let date = new Date(currentDate),
    day = date.getDate().toString(),
    dayF = day.length == 1 ? "0" + day : day,
    month = (date.getMonth() + 1).toString(),
    monthF = month.length == 1 ? "0" + month : month,
    yearF = date.getFullYear();

  return dayF + "/" + monthF + "/" + yearF;
};

Vue.filter("formatPrice", formatPrice);
Vue.filter("formatDateBr", formatDateBr);
