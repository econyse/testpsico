import { defineStore } from "pinia";

export const useQuestionStore = defineStore("qustion", {
  state: () => ({
    number: 1,
    questions: [],
    answers: {},
  }),
  actions: {
    nextQuestion() {
      this.number++;
    },
    prevQuestion() {
      this.number--;
    },
    loadQuestions(questions) {
      this.questions = questions;
    },
    addAnswers(qId, answers) {
      this.answers[qId] = answers;
    },
  },
});
