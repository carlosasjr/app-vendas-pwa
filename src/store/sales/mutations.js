import { status } from "src/boot/constants";
const mutations = {
  SET_LOCAL_ALL_SALES(state, salers) {
    state.localSales = salers;
  },

  UPDATE_STATUS_SALE_INTEGRATED(state, uuid) {
    state.localSales.map((sale) => {
      if (sale.uuid == uuid) {
        sale.status = status.INTEGRATED;
      }
    });
  },

  UPDATE_STATUS_SALE_PROCESSED(state, sale) {
    state.localSales.map((item) => {
      if (item.uuid == sale.uuid) {
        item.status = status.PROCESSED;
        item.code_erp = sale.code_erp;
      }
    });
  },

  ADD_LOCAL_SELLER(state, saler) {
    state.localSales.push(saler);
  },
};

export default mutations;
