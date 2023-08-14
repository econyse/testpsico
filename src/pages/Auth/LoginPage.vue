<template>
  <q-page>
    <div class="row justify-center">
      <q-card class="col-md-4 col-xs-12 text-center">
        <q-card-section>
          <h4 class="q-my-none">Iniciar Sesión</h4>
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            rounded
            hide-bottom-space
            outlined
            v-model="email"
            type="email"
            label="E-mail"
            :rules="[
              (val) => !!val || 'Favor de llenar el campo.',
              (v) =>
                emailPattern.test(v) || 'Favor de introducir un correo válido.',
            ]"
          />
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            rounded
            hide-bottom-space
            outlined
            v-model="password"
            type="password"
            label="Contraseña"
            :rules="[(val) => !!val || 'Favor de llenar el campo.']"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            rounded
            hide-bottom-space
            icon="send"
            class="full-width"
            color="positive"
            size="lg"
            :disable="!isValid"
            label="Iniciar"
            @click="login"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth-store";
export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const authStore = useAuthStore();
    const email = ref(null);
    const password = ref(null);
    const emailPattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = computed(() => !!email.value && !!password.value);
    function login() {
      var data = {
        identifier: email.value,
        password: password.value,
      };
      $q.loading.show();
      api
        .post("/api/auth/local", data)
        .then((res) => {
          try {
            $q.sessionStorage.set("jwt", res.data.jwt);
            $q.sessionStorage.set("email", res.data.user.email);
            $q.sessionStorage.set("userid", res.data.user.id);
            $q.sessionStorage.set("name", res.data.user.name);
            $q.sessionStorage.set("flastname", res.data.user.flastname);
            $q.sessionStorage.set("mlastname", res.data.user.mlastname);
            $q.sessionStorage.set("carrera", res.data.user.carrera);
            $q.sessionStorage.set("roleid", res.data.user.roleid);

            authStore.setAuth(
              res.data.jwt,
              res.data.user.username,
              res.data.user.email,
              res.data.user.roleid,
              res.data.user.carrera
            );
          } catch (e) {
            console.error(e);
          }
          $q.loading.hide();
          if (res.data.user.roleid == 3) {
            router.push("/admin");
          } else if (res.data.user.roleid == 1) {
            router.push("/alumno");
          }
        })
        .catch((e) => {
          $q.notify({
            color: "negative",
            textColor: "white",
            message: "Usuario y contraseña no coinciden.",
            position: "center",
            actions: [
              {
                label: "Cerrar",
                color: "yellow",
                handler: () => {
                  /* console.log('wooow') */
                },
              },
            ],
          });
          $q.loading.hide();
        });
    }
    return {
      email,
      password,
      emailPattern,
      isValid,
      login,
    };
  },
};
</script>
