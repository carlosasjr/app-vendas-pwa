const status = {
  OPEN: "Aberto",
  FINISH_LATER: "Aguardando Finalizar",
  FINISH: "Finalizado",
  INTEGRATED: "Integrado",
  PROCESSED: "Processado",
};

export default async ({ Vue }) => {
  Vue.prototype.$SaleStatus = status;
};

export { status };
