<template>
  <q-page>
    <div class="row justify-center">
      <q-card class="col-md-4 col-xs-12 text-center">
        <q-card-section>
          <h4 class="q-my-none">Registrarse</h4>
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            rounded
            hide-bottom-space
            outlined
            v-model="name"
            label="Nombre(s)"
            :rules="[(val) => !!val || 'Favor de llenar el campo.']"
          />
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            rounded
            hide-bottom-space
            outlined
            v-model="flastname"
            label="Apellido Paterno"
            :rules="[(val) => !!val || 'Favor de llenar el campo.']"
          />
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            rounded
            hide-bottom-space
            outlined
            v-model="mlastname"
            label="Apellido Materno"
          />
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-select
            rounded
            hide-bottom-space
            outlined
            v-model="carrera"
            :options="options"
            label="Carrera"
            :rules="[(val) => !!val || 'Favor de seleccionar una carrera.']"
            emit-value
            map-options
          />
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
            :rules="[
              (val) => !!val || 'Favor de llenar el campo.',
              (v) =>
                passwordPattern.test(v) ||
                'La contraseña debe tener un mínimo de ocho caracteres, al menos una letra mayúscula, una letra minúscula y un número.',
            ]"
          />
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            rounded
            hide-bottom-space
            outlined
            v-model="confirm"
            type="password"
            label="Confirmar Contraseña"
            :rules="[
              (val) => !!val || 'Favor de llenar el campo.',
              (v) => v == password || 'Las contraseñas no coinciden.',
            ]"
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
            label="Registrar"
            @click="register"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth-store";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const authStore = useAuthStore();
    const name = ref(null);
    const flastname = ref(null);
    const mlastname = ref(null);
    const carrera = ref(null);
    const email = ref(null);
    const password = ref(null);
    const confirm = ref(null);
    const options = [
      {
        label: "Administración",
        value: 1,
      },
      {
        label: "Energías Renovables",
        value: 2,
      },
      {
        label: "Mantenimiento Industrial",
        value: 3,
      },
      {
        label: "Mecatrónica",
        value: 4,
      },
      {
        label: "Procesos Industriales",
        value: 5,
      },
      {
        label: "Tecnologías de la Información",
        value: 6,
      },
    ];
    const emailPattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const isValid = computed(
      () =>
        !!name.value &&
        !!flastname.value &&
        !!carrera.value &&
        !!email.value &&
        !!password.value
    );
    function register() {
      var data = {
        username: email.value.trim(),
        email: email.value,
        password: password.value,
        name: name.value.trim(),
        flastname: flastname.value.trim(),
        mlastname: mlastname.value.trim(),
        carrera: carrera.value,
      };
      $q.loading.show();
      api
        .post("/api/auth/local/register", data)
        .then((res) => {
          console.log(res);
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
          router.push("/alumno");
        })
        .catch((e) => {
          console.log(e);
          $q.notify({
            color: "negative",
            textColor: "white",
            message: "Error",
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
      name,
      flastname,
      mlastname,
      carrera,
      email,
      password,
      confirm,
      options,
      emailPattern,
      passwordPattern,
      isValid,
      register,
    };
  },
};
</script>
