import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "src/stores/auth-store";
import { SessionStorage, LocalStorage } from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from) => {
    const authStore = useAuthStore();
    if (SessionStorage.has("jwt") && !authStore.isLogged) {
      authStore.setAuth(
        SessionStorage.getItem("jwt"),
        SessionStorage.getItem("email"),
        SessionStorage.getItem("email"),
        SessionStorage.getItem("roleid"),
        SessionStorage.getItem("carrera")
      );
    }
    if (to.meta.noAuth && authStore.isLogged) {
      return {
        path: from.path,
      };
    }
    if (to.meta.isLogged && !authStore.isLogged) {
      return {
        path: "/login",
      };
    }
    console.log(authStore.roleid);
    console.log(to.meta.isStudent);
    console.log(to.meta.isAdmin);
    if (to.meta.isStudent && !(authStore.roleid == 1)) {
      return {
        path: from.path,
      };
    }
    if (to.meta.isAdmin && !(authStore.roleid == 3)) {
      return {
        path: from.path,
      };
    }
  });

  return Router;
});
