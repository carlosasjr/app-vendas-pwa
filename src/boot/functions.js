export default async ({ Vue, store }) => {
  Vue.prototype.$helper = {
    uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    strToFloat(value) {
      value = value ?? 0;

      if (
        value.toString().indexOf(",") > -1 ||
        value.toString().indexOf(".") > -1
      ) {
        value = parseInt(value.toString().replace(/[.,]/g, ""));
        return value / 100;
      }

      return parseInt(value.toString().replace(/[.,]/g, ""));
    },

    formatFloat(value) {
      value = value ?? 0;
      if (typeof value == "string")
        return parseInt(value.toString().replace(/[.,]/g, "")) / 100;

      return value;
    },
  };
};
