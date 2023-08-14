import { LocalStorage, SessionStorage } from "quasar";
import { useAuthStore } from "src/stores/auth-store";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "login",
        component: () => import("pages/Auth/LoginPage.vue"),
        meta: { noAuth: true },
      },
      {
        path: "register",
        component: () => import("pages/Auth/RegisterPage.vue"),
        meta: { noAuth: true },
      },
      {
        path: "logout",
        beforeEnter: (to, from, next) => {
          const authSotre = useAuthStore();
          if (SessionStorage.has("jwt")) {
            SessionStorage.clear();
            authSotre.clear();
            next("/");
          } else {
            next(from.path);
          }
        },
      },
    ],
  },
  {
    path: "/alumno/",
    component: () => import("layouts/AuthLayout.vue"),
    // beforeEnter: (to, from, next) => {
    //   if (SessionStorage.getItem("roleid") == 1) {
    //     next();
    //   } else next("/login");
    // },
    meta: { isLogged: true, isStudent: true },
    children: [
      {
        path: "",
        component: () => import("pages/Student/HomePage.vue"),
      },
      {
        path: "test",
        component: () => import("pages/Student/TestPage.vue"),
      },
    ],
  },
  {
    path: "/admin/",
    component: () => import("layouts/AuthLayout.vue"),
    // beforeEnter: (to, from, next) => {
    //   if (SessionStorage.getItem("roleid") == 3) {
    //     next();
    //   } else next("/login");
    // },
    meta: { isLogged: true, isAdmin: true },
    children: [
      {
        path: "",
        component: () => import("pages/Admin/HomePage.vue"),
      },
      {
        path: "reporte",
        component: () => import("pages/Admin/TestReport.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
