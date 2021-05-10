<template>
  <div v-if="!isLoading">
    <v-toolbar elevation="0">
      <v-toolbar-title class="font-weight-medium toolbar-title">Scanresultaten</v-toolbar-title>
      <v-spacer/>
      <v-breadcrumbs :items="getBreadcrumbs" class="breadcrumbs" v-if="!isSmallScreen">
        <template v-slot:divider>
          <v-icon color="#A8A8A8">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <v-btn color="custom-green" class="custom-static-btn toolbar-btn" depressed @click="redirectToSelectTeamscan()" v-if="!isSmallScreen">
        <v-icon left color="white">mdi-message-text</v-icon>
        <span class="custom-text-btn">Selecteer Teamscan</span>
      </v-btn>

      <v-btn color="custom-green" class="custom-static-btn toolbar-btn" depressed v-if="!isSmallScreen">
        <v-icon left color="white">mdi-file-download</v-icon>
        <span class="custom-text-btn">Exporteer</span>
      </v-btn>
    </v-toolbar>

    <v-container fluid class="cards-position">
      <ScoreCard :dysfunctions="dysfunctions" :levels="levels" :scores="this.teamscan" :previous-teamscan="this.previousTeamscan"/>

      <v-row class="v-row-content">
        <v-col cols="12" md="5" class="first-column">
          <v-row no-gutters class="first-row">
            <v-card width="100%" align="center" class="interpretation-card">
              <v-card-title class="interpretation-card-title">Interpretatie</v-card-title>
              <v-carousel :show-arrows="false" height="100%" hide-delimiter-background light>
                <v-carousel-item v-for="(interpretation, index) in interpretations" :key="index">
                    <v-container fluid class="fill-height">
                      <v-row align="center" justify="center">
                        <v-col cols="4" v-if="!isExtraSmallScreen">
                        </v-col>
                        <v-col cols="12" sm="8" align="start">
                          <h1 class="interpretation-dysfunction-title">
                            {{ getInterpretationDysfunctionTitle(interpretation.interpretation.dysfunctionId) }}
                          </h1>
                          <span v-text="interpretation.text" class="interpretation-dysfunction-text"/>
                        </v-col>
                      </v-row>
                    </v-container>
                </v-carousel-item>
              </v-carousel>
            </v-card>
          </v-row>
          <v-row no-gutters class="second-row">
            <v-card width="100%" align="center" class="individual-results-card">
              <v-card-title>Individuele Resultaten</v-card-title>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="12" md="7" class="second-column">
          <v-card class="progress-card">
            <v-container class="progress-container">
            <v-card-title>Vooruitgang</v-card-title>
              <v-card height="100%">
                <v-tabs v-model="tab">
                  <v-tab @click="test2">Piramide</v-tab>
                  <v-tab @click="test">Grafiek</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <v-container>
                      <h1>
                        PYRAMIDE
                      </h1>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                      <line-chart
                         :chartTitles="chartTitles"
                         :chartData="chartData"
                         :options="chartOptions"/>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="v-row-content">
        <v-col>
          <v-card>
            <v-card-title>
              Aanbevelingen
              <v-spacer></v-spacer>
              <v-btn icon @click="show = !show"  >
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-title>
            <v-expand-transition>
              <v-container fluid v-show="show" class="expansion-panel-position">
                <v-expansion-panels>
                  <v-expansion-panel v-for="(dysfunction, index) in dysfunctions" :key="index">
                    <v-expansion-panel-header class="font-weight-medium expansion-header">{{ dysfunction.name }}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list>
                        <v-list-item v-for="(recommendation, index) in getRecommendationsByDysfunction(dysfunction.dysfunction.id)" :key="index">
                          <v-list-item-icon class="me-1">
                            <v-icon x-small color="#71BF42" v-text="'mdi-brightness-1'"/>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-medium list-item-title">
                              {{ recommendation.title }}
                            </v-list-item-title>
                            <v-list-item-content class="list-item-text" v-text="recommendation.text"/>
                            <v-list-item-icon style="margin: 0">
                              <v-chip small :href="recommendation.recommendation.link" target="_blank" v-if="recommendation.recommendation.link !== null">
                                <v-avatar left>
                                  <v-icon small>mdi-information</v-icon>
                                </v-avatar>
                                Meer informatie
                              </v-chip>
                            </v-list-item-icon>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-container>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-fab-transition v-if="isSmallScreen">
      <v-btn fab right bottom fixed color="custom-green" class="custom-static-btn">
        <v-icon color="white">mdi-file-download</v-icon>
      </v-btn>
    </v-fab-transition>

  </div>
</template>

<script>
import ScoreCard from "@/components/ScoreCard";
import { globalMixin } from '@/mixins/globalMixin'
import { scoreMixin } from '@/mixins/scoreMixin'
import LineChart from "../../components/LineChart";

export default {
  name: "Scanresults",
  mixins: [globalMixin, scoreMixin],
  components: {
    ScoreCard,
    LineChart
  },
  data() {
    return {
      show: true,
      isLoading: true,
      teamscan: {},
      previousTeamscan: {},
      dysfunctions: [],
      levels: [],
      recommendations: [],
      interpretations: [],
      tab: null,

      chartData: [],
      chartTitles: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              min: 1,
              max: 5,
              stepSize: 1
            }
          }]
        }
      },
    }
  },
  async created() {
    const teamscan = await this.$axios.get(`teamscans/finished/${this.$auth.user.id}/${this.$route.params.id}`)
    const previousTeamscan = await this.$axios.get(`teamscans/previous/${this.$auth.user.id}/${this.$route.params.id}`)
    const levels = await this.$axios.get(`levels`)
    const dysfunctions = await this.$axios.get(`dysfunctiontranslations/language/${this.$auth.user.preferredLanguageId}`)
    const recommendations = await this.$axios.get(`recommendationtranslations/${2}`)
    const interpretations = await this.$axios.get(`interpretationtranslations/${this.$auth.user.preferredLanguageId}/${this.$route.params.id}`)

    this.teamscan = teamscan.data
    this.previousTeamscan = previousTeamscan.data
    this.levels = levels.data
    this.dysfunctions = dysfunctions.data
    this.recommendations = recommendations.data
    this.interpretations = interpretations.data

    await this.createChart()

    this.isLoading = false
  },
  computed: {
    getBreadcrumbs() {
      return [{ text: this.teamscan.team.name }, { text: this.teamscan.title }]
    },
  },
  methods: {
    async createChart() {
      let arrScoreTrust = []
      let arrScoreConflict = []
      let arrScoreCommitment = []
      let arrScoreAccountability = []
      let arrScoreResults = []

      const listTeamscans = await this.$axios.get(`teamscans/team/${this.teamscan.team.id}`)

      listTeamscans.data.forEach(teamscan => {
        const title = teamscan.title
        const {
          scoreTrust,
          scoreConflict,
          scoreCommitment,
          scoreAccountability,
          scoreResults
        } = teamscan;

        this.chartTitles.push(title)
        arrScoreTrust.push(scoreTrust)
        arrScoreConflict.push(scoreConflict)
        arrScoreCommitment.push(scoreCommitment)
        arrScoreAccountability.push(scoreAccountability)
        arrScoreResults.push(scoreResults)
      })

      this.chartData = [
        {
          label: this.dysfunctions[0].name,
          data: arrScoreTrust,
          fill: false,
          borderColor: '#4DC9F6',
          pointBorderColor: '#4DC9F6',
          pointBackgroundColor: '#4DC9F6',
        },
        {
          label: this.dysfunctions[1].name,
          data: arrScoreConflict,
          fill: false,
          borderColor: '#F67019',
          pointBorderColor: '#F67019',
          pointBackgroundColor: '#F67019',
        },
        {
          label: this.dysfunctions[2].name,
          data: arrScoreCommitment,
          fill: false,
          borderColor: '#F53794',
          pointBorderColor: '#F53794',
          pointBackgroundColor: '#F53794',
        },
        {
          label: this.dysfunctions[3].name,
          data: arrScoreAccountability,
          fill: false,
          borderColor: '#537BC4',
          pointBorderColor: '#537BC4',
          pointBackgroundColor: '#537BC4',
        },
        {
          label: this.dysfunctions[4].name,
          data: arrScoreResults,
          fill: false,
          borderColor: '#00A950',
          pointBorderColor: '#00A950',
          pointBackgroundColor: '#00A950',
        }
      ]
    },
    redirectToSelectTeamscan() {
      this.$router.push({
        path: `/scanresults`
      })
    },
    getRecommendationsByDysfunction(dysfunctionId) {
      return this.recommendations.filter(recommendation => recommendation.recommendation.dysfunctionId === dysfunctionId)
    },
    getInterpretationDysfunctionTitle(prop) {
      return this.dysfunctions[prop - 1].name
    }
  },
}
</script>

<style scoped>
.toolbar-title {
  color: #343A40;
  font-size: 24px;
}
.progress-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.breadcrumbs {
  color: #A8A8A8;
  font-size: 16px;
}
.cards-position {
  margin-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
.v-row-content {
  margin-top: 5px;
}
.individual-results-card {
  margin-top: 8px;
}
.interpretation-card {
  margin-bottom: 8px;
}
.interpretation-card-title {
  position: absolute;
  z-index: 1;
}
.interpretation-dysfunction-title {
  font-size: 0.9375em;
  text-align: start;
  margin-bottom: 2px;
  padding-left: 6px;
}
.interpretation-dysfunction-text {
  font-size: 0.8750em;
  display: block;
  padding-left: 6px;
}
.first-row {
  height: 29vh;
}
.second-row {
  height: 29vh;
}
.first-column {
  padding-right: 7px;
}
.second-column {
  padding-left: 10px;
}
.progress-card {
  height: 58vh;
}
.expansion-panel-position {
  padding-top: 0;
}
.list-item-title {
  font-size: 15px;
}
.list-item-text {
  font-size: 14px;
  padding-top: 6px;
}
.expansion-header {
  font-size: 16px;
}
</style>
