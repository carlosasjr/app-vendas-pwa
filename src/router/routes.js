const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout"),
    children: [
      {
        path: "",
        component: () => import("pages/Auth/Login"),
        name: "login",
        meta: { title: "Login" },
      },

      {
        path: "companies",
        component: () => import("pages/Company/Company.vue"),
        name: "companies",
        meta: { title: "Nova Empresa" },
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

      {
        path: "/clients",
        component: () => import("pages/Clients/Clients.vue"),
        name: "clients",
        meta: { title: "Clientes", auth: true },
      },

      {
        path: "/products",
        component: () => import("pages/Products/Products.vue"),
        name: "products",
        meta: { title: "Produtos", auth: true },
      },

      {
        path: "/checkout",
        component: () => import("pages/Cart/CheckOut.vue"),
        name: "checkout",
        meta: { title: "Venda", auth: true },
      },

      {
        path: "/sales",
        component: () => import("pages/Sales/Sales.vue"),
        name: "sales",
        meta: { title: "Vendas", auth: true },
      },

      {
        path: "/sales/items",
        component: () => import("pages/Sales/SalesEditItems.vue"),
        name: "sales.items",
        meta: { title: "Editar itens da venda", auth: true },
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
