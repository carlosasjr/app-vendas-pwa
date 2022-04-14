export default ({ router, store, urlPath }) => {
  router.beforeEach((to, from, next) => {
    document.title = "SoftPro +Vendas";

    if (to.hasOwnProperty("meta")) {
      document.title = to.meta.title;
    }

    if (
      to.meta.auth &&
      !store.state.auth.authenticated &&
      !urlPath.startsWith("/login")
    ) {
      store.commit('CHANGE_URL_BACK', to.name)
      return router.push({ name: "login" });
    }

    if (
      to.matched.some((record) => record.meta.auth) &&
      !store.state.auth.authenticated &&
      !urlPath.startsWith("/login")
    ) {
      store.commit('CHANGE_URL_BACK', to.name)
      return router.push({ name: "login" });
    }

    if (
      to.meta.hasOwnProperty("auth") &&
      !to.meta.auth &&
      store.state.auth.authenticated &&
      !urlPath.startsWith("/login")
    ) {

      return router.push({ name: "/index" });
    }

    next();
  });

  let authenticated = window.localStorage.getItem('auth')

  if (authenticated) {
     store.commit("SET_AUTHENTICATED", JSON.parse(authenticated))

     router.push({ name: store.state.auth.url_back })
  }

};
