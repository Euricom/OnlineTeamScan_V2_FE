<template>
  <div>
    <v-toolbar elevation="0" extended>
      <v-toolbar-title class="font-weight-medium toolbar-title">
        {{ this.teamscan.title }}
      </v-toolbar-title>
      <template v-slot:extension>
        <div class="sub-toolbar-title-position">
          <h1 class="font-weight-medium sub-toolbar-title">Gestart door: {{ startedByFullname }}</h1>
          <h1 class="font-weight-medium sub-toolbar-title">Startdatum: {{ formatDate }}</h1>
        </div>
      </template>
    </v-toolbar>

    <v-container fluid v-if="!this.individualScore.hasAnswered">
      <QuestionCard ref="questionAnswers" v-for="question in questions" :key="question.question.id" :question="question"/>
      <v-btn class="final-button" color="#71BF42">
        <span class="final-button-save-button" @click="saveTeamscan">Opslaan</span>
      </v-btn>
    </v-container>
    <v-container fluid v-else>
      <ScoreCard :dysfunctions="dysfunctions" :levels="levels" :scores="individualScore"/>
    </v-container>

    <v-snackbar v-model="snackbar">
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false" color="custom-green">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import QuestionCard from "@/components/QuestionCard";
import ScoreCard from "@/components/ScoreCard";
export default {
  name: "Teamscan",
  components: {
    QuestionCard,
    ScoreCard,
  },
  validate({ params }) {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return guidRegex.test(params.id)
  },
  data() {
    return {
      dysfunctions: [],
      levels: [],
      questions: [],
      individualScore: {},
      teamscan: {},
      snackbar: false,
      errorMessage: '',
      defaultLanguage: 1,
    }
  },
  async created() {
    const score = await this.$axios.get(`individualscores/include/${this.$route.params.id}`)

    if (!score.data.hasAnswered) {
      const questions = await this.$axios.get(`questiontranslations/language/${this.getPreferredLanguage}`)
      this.questions = questions.data
    }
    else {
      await this.getDysfunctionsAndLevels()
    }
    this.individualScore = score.data
    this.teamscan = score.data.teamscan
  },
  computed: {
    startedByFullname() {
      return this.teamscan.startedBy !== undefined ? `${this.teamscan.startedBy.firstname} ${this.teamscan.startedBy.lastname}` : ''
    },
    formatDate() {
      if (this.teamscan.startDate === undefined) return ''

      let date = new Date(this.teamscan.startDate)
      let day = date.getDate().toString().padStart(2,'0')
      let month = (date.getMonth() + 1).toString().padStart(2,'0')
      let year = date.getFullYear().toString()
      return `${day}/${month}/${year}`
    },
    getPreferredLanguage() {
      return this.$auth.loggedIn ? this.$auth.user.preferredLanguageId : this.defaultLanguage
    },
  },
  methods: {
    async saveTeamscan() {
      const answers = this.$refs.questionAnswers.map(x => x.returnAnswer())

      try {
        const result = await this.$axios.put(`individualscores/${this.individualScore.id}`, answers)
        await this.getDysfunctionsAndLevels()
        const updatedIndividualScore = {
          scoreAccountability: result.data.scoreAccountability,
          scoreCommitment: result.data.scoreCommitment,
          scoreConflict: result.data.scoreConflict,
          scoreResults: result.data.scoreResults,
          scoreTrust: result.data.scoreTrust,
          hasAnswered: result.data.hasAnswered
        }
        Object.assign(this.individualScore, updatedIndividualScore)
      }
      catch (err) {
        this.snackbar = true
        this.errorMessage = err.response.data
      }
    },
    async getDysfunctionsAndLevels() {
      const dysfunctions = await this.$axios.get(`dysfunctiontranslations/language/${this.getPreferredLanguage}`)
      const levels = await this.$axios.get(`levels`)
      this.dysfunctions = dysfunctions.data
      this.levels = levels.data
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
</style>
