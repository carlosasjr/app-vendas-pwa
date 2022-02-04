const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout"),
    children: [
      {
        path: "",
        component: () => import("pages/auth/Login"),
        name: "login",
        meta: { title: "Login" },
      },

      {
        path: "companies",
        component: () => import("pages/Company/Company.vue"),
        name: "companies",
      },
    ],
  },

  {
    path: "/admin",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
        name: "index",
        meta: { title: "Dashboard", auth: true },
      },
    ],
  },

  ,
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
