<template>
  <q-page>
    <div class="row">
      <div class="col q-ma-md q-pa-sm bg-grey pill">
        <h2 class="text-center q-my-none">Test</h2>
        <div class="row q-mx-lg justify-center">
          <div class="col-md-6 col-xs-12 text-h5 text-center">
            Alumno: {{ name }}
          </div>
          <div class="col-md-6 col-xs-12 text-h5 text-center">
            Carrera: {{ carrera }}
          </div>
        </div>
      </div>
    </div>
    <question-comp-vue v-if="questionStore.questions" />
  </q-page>
</template>

<script>
import { ref } from "vue";
import QuestionCompVue from "components/Student/QuestionComp.vue";
import { useQuestionStore } from "src/stores/question-store";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

export default {
  components: {
    QuestionCompVue,
  },
  setup() {
    const questionStore = useQuestionStore();
    const $q = useQuasar();
    const name = ref(
      $q.sessionStorage.getItem("name").split(" ")[0] +
        " " +
        $q.sessionStorage.getItem("flastname")
    );
    const carrera = ref();
    switch ($q.sessionStorage.getItem("carrera")) {
      case 1:
        carrera.value = "Administración";
        break;
      case 2:
        carrera.value = "Energías Renovables";
        break;
      case 3:
        carrera.value = "Mantenimiento Industrial";
        break;
      case 4:
        carrera.value = "Mecatrónica";
        break;
      case 5:
        carrera.value = "Procesos Industriales";
        break;
      case 6:
        carrera.value = "Tecnologías de la Información";
        break;
    }
    return {
      questionStore,
      name,
      carrera,
      $q,
    };
  },
  mounted() {
    api
      .get("/api/questions?populate=questionAnswers", {
        headers: {
          Authorization: "Bearer " + this.$q.sessionStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        this.questionStore.questions = res.data.data;
        for (var i = 0; i < res.data.data.length; i++) {
          this.questionStore.answers[i + 1] = [];
        }
      });
  },
};
</script>

<style>
.pill {
  border-radius: 50rem;
}
</style>
