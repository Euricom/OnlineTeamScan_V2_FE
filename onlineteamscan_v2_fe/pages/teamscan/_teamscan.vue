<template>
  <div>
    <v-toolbar elevation="0" extended>
      <v-toolbar-title class="font-weight-medium toolbar-title">
        Teamscan 8
      </v-toolbar-title>
      <template v-slot:extension>
        <div class="sub-toolbar-title-position">
          <h1 class="font-weight-medium sub-toolbar-title">Gestart door: Thomas Claessens</h1>
          <h1 class="font-weight-medium sub-toolbar-title">Startdatum: 15/11/2020</h1>
        </div>
      </template>
    </v-toolbar>

    <v-container fluid>
      <QuestionCard ref="questionAnswers" v-for="question in questions" :key="question.question.id" :question="question"/>

      <v-btn class="final-button" color="#71BF42">
        <span class="final-button-save-button" @click="saveTeamscan">Opslaan</span>
      </v-btn>
      <v-btn class="final-button" color="#FFFFFF">
        <span class="final-button-cancel-button" @click="cancel">Annuleren</span>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import QuestionCard from "@/components/QuestionCard";
export default {
  name: "Teamscan",
  components: {
    QuestionCard
  },
  data() {
    return {
      questions: [],
      answers: [],
    }
  },
  async created() {
    let questions = await this.$axios.get(`questiontranslations/language/${this.$auth.user.preferredLanguageId}`)
    this.questions = questions.data
  },
  methods: {
    cancel() {

    },
    saveTeamscan() {
      this.answers = this.$refs.questionAnswers.map(x => x.returnAnswer())
      console.log(this.answers)

      /*this.$axios.post(`individualscores/3/1`, this.answers)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))*/
    },
  },
}
</script>

<style scoped>
.toolbar-title {
  color: #343A40;
  font-size: 24px;
}
.sub-toolbar-title {
  font-size: 16px;
  color: #A8A8A8
}
.sub-toolbar-title-position {
  margin-bottom: 25px;
}
.final-button {
  float: right;
  font-weight: normal;
  text-transform: none;
  font-size: 14px;
  margin-right: 15px;
  margin-bottom: 15px;
  width: 110px;
}
.final-button-save-button {
  color: white;
  font-weight: bold;
}
.final-button-cancel-button {
  color: #212121;
  font-weight: bold;
}
</style>
