import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    jwt: null,
    username: null,
    email: null,
    roleid: null,
    carrera: null,
  }),
  getters: {
    isLogged: (state) => !!state.jwt && !!state.username && !!state.email,
  },
  actions: {
    setAuth(jwt, username, email, roleid, carrera) {
      this.jwt = jwt;
      this.username = username;
      this.email = email;
      this.roleid = roleid;
      this.carrera = carrera;
    },
    clear() {
      this.jwt = null;
      this.username = null;
      this.email = null;
      this.roleid = null;
      this.carrera = null;
    },
  },
});
