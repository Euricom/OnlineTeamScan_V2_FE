<template>
  <div v-if="!isLoading">
    <v-toolbar elevation="0" extended>
      <v-toolbar-title class="font-weight-medium toolbar-title">{{ getToolbarTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="custom-green" class="custom-static-btn" depressed v-if="!isSmallScreen && this.individualScore.hasAnswered">
        <v-icon left color="white">mdi-file-download</v-icon>
        <span class="new-team-icon">Exporteer</span>
      </v-btn>
      <template v-slot:extension>
        <div class="sub-toolbar-title-position">
          <h1 class="font-weight-medium sub-toolbar-title">Gestart door: {{ startedByFullname }}</h1>
          <h1 class="font-weight-medium sub-toolbar-title">Startdatum: {{ getDate }}</h1>
        </div>
      </template>
    </v-toolbar>

    <v-container fluid v-if="!this.individualScore.hasAnswered">
      <QuestionCard ref="questionAnswers" v-for="question in questions" :key="question.question.id" :question="question"/>
      <v-btn color="custom-green" class="custom-default-btn final-button" depressed>
        <span class="new-team-icon" @click="saveTeamscan">Opslaan</span>
      </v-btn>
    </v-container>
    <v-container class="score-container" fluid v-else>
      <ScoreCard :dysfunctions="dysfunctions" :levels="levels" :scores="individualScore"/>
    </v-container>

    <v-fab-transition v-if="isSmallScreen && this.individualScore.hasAnswered">
      <v-btn fab right bottom fixed color="custom-green" class="custom-static-btn">
        <v-icon color="white">mdi-file-download</v-icon>
      </v-btn>
    </v-fab-transition>

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
import { globalMixin } from '@/mixins/globalMixin'
export default {
  name: "Teamscan",
  mixins: [globalMixin],
  layout: (context) => context.$auth.loggedIn ? 'default' : 'guest',
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
      isLoading: true,
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
    this.teamscan = score.data.teamscan
    this.individualScore = score.data
    this.isLoading = false
  },
  computed: {
    getToolbarTitle() {
      return this.teamscan.team !== undefined ? `${this.teamscan.team.name} - ${this.teamscan.title}` : ''
    },
    startedByFullname() {
      return this.teamscan.startedBy !== undefined ? `${this.teamscan.startedBy.firstname} ${this.teamscan.startedBy.lastname}` : ''
    },
    getDate() {
      return this.teamscan.startDate === undefined ? '' : this.formatDate(this.teamscan.startDate)
    },
    getPreferredLanguage() {
      return this.$auth.loggedIn ? this.$auth.user.preferredLanguageId : this.defaultLanguage
    },
  },
  methods: {
    async saveTeamscan() {
      const answers = this.$refs.questionAnswers.map(x => x.returnAnswer())

      try {
        answers.map(x => { if(x.Score === null) throw 'Niet alle vragen zijn ingevuld' })

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
        this.errorMessage = err.response !== undefined ? err.response.data : err
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
  margin-right: 15px;
  margin-bottom: 15px;
}
.score-container {
  margin-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
