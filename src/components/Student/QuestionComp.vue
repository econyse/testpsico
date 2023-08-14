<template>
  <q-card
    :class="$q.screen.lt.md ? 'q-mb-md' : 'q-mx-xl'"
    v-if="questionStore.questions.length"
  >
    <q-card-section align="center">
      <h4 class="q-my-none">Pregunta #{{ questionStore.number }}</h4>
      <h4 class="q-my-none">
        {{
          questionStore.questions[questionStore.number - 1].attributes
            .questionText
        }}
      </h4>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div
          class="col-md-6 col-xs-12"
          v-for="(answer, index) in questionStore.questions[
            questionStore.number - 1
          ].attributes.questionAnswers"
          :key="index + 1"
        >
          <q-card class="q-ma-xs q-pa-xs" bordered>
            <q-list>
              <q-item clickable>
                <q-item-section>
                  <q-checkbox
                    size="lg"
                    v-model="questionStore.answers[questionStore.number]"
                    :val="answer.hiddenValue"
                    :label="answer.answerText"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn
        icon="arrow_left"
        label="Anterior"
        glossy
        size="lg"
        rounded
        color="blue"
        v-if="questionStore.number > 1"
        @click="questionStore.prevQuestion"
      />
      <q-space />
      <q-btn
        icon-right="arrow_right"
        label="Siguiente"
        glossy
        size="lg"
        rounded
        color="green"
        :disable="questionStore.answers[questionStore.number].length == 0"
        v-if="questionStore.number < 16"
        @click="questionStore.nextQuestion"
      />
      <q-btn
        icon-right="arrow_right"
        label="Finalizar"
        glossy
        size="lg"
        rounded
        color="green"
        :disable="questionStore.answers[questionStore.number].length == 0"
        v-if="questionStore.number == 16"
        @click="saveTest"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref, toRaw } from "vue";
import { useQuestionStore } from "src/stores/question-store";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";

export default {
  name: "QuestionComp",
  setup() {
    const questionStore = useQuestionStore();
    const $q = useQuasar();
    const router = useRouter();
    function saveTest() {
      var data = {
        data: {
          users_permissions_user: {
            id: $q.sessionStorage.getItem("userid"),
          },
          answers: toRaw(questionStore.answers),
          email: $q.sessionStorage.getItem("email"),
          carrera: $q.sessionStorage.getItem("carrera"),
        },
      };
      $q.loading.show();
      api
        .post("/api/test-answers", data, {
          headers: {
            Authorization: "Bearer " + $q.sessionStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          console.log(res);
          $q.loading.hide();
          router.push("/alumno");
        })
        .catch((e) => {
          console.log(e);
          $q.loading.hide();
        });
    }
    return {
      questionStore,
      saveTest,
    };
  },
};
</script>
