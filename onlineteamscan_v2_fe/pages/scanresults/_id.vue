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
        <span class="new-team-icon">Selecteer Teamscan</span>
      </v-btn>

      <v-btn color="custom-green" class="custom-static-btn toolbar-btn" depressed v-if="!isSmallScreen">
        <v-icon left color="white">mdi-file-download</v-icon>
        <span class="new-team-icon">Exporteer</span>
      </v-btn>
    </v-toolbar>

    <v-container fluid class="cards-position">
      <ScoreCard :dysfunctions="dysfunctions" :levels="levels" :scores="this.teamscan" :previous-teamscan="this.previousTeamscan"/>

      <v-row class="v-row-content">
        <v-col cols="12" md="5" class="first-column">
          <v-row no-gutters class="first-row">
            <v-card width="100%" align="center" class="interpretation-card">
              <v-card-title style="position: absolute; z-index: 1">Interpretatie</v-card-title>
              <v-carousel :show-arrows="false" height="100%" hide-delimiter-background light delimiter-icon="mdi-minus">
                <v-carousel-item v-for="(interpretation, index) in interpretations" :key="index">
                    <v-container fluid class="fill-height">
                      <v-row align="center" justify="center">
                        <v-col cols="4" v-if="!isExtraSmallScreen">

                        </v-col>
                        <v-col cols="12" sm="8">
                          <h1 style="font-size: 0.8750em; text-align: start; margin-bottom: 2px; padding-left: 6px;">
                            {{ getInterpretationDysfunctionTitle(interpretation.interpretation.dysfunctionId) }}
                          </h1>
                          <span style="font-size: 0.8750em; text-align: start; display: block; padding-left: 6px;">{{ interpretation.text }}</span>
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
            <v-card-title>Vooruitgang</v-card-title>
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
                              {{ recommendation.title }} &nbsp;
                              <br v-if="isExtraSmallScreen"/>
                              <v-chip :href="recommendation.recommendation.link" target="_blank" v-if="recommendation.recommendation.link !== null" x-small>Meer informatie</v-chip>
                            </v-list-item-title>
                            <v-list-item-content class="list-item-text" v-text="recommendation.text"/>
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
export default {
  name: "Scanresults",
  mixins: [globalMixin, scoreMixin],
  components: {
    ScoreCard,
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
    }
  },
  async created() {
    const teamscan = await this.$axios.get(`teamscans/finished/${this.$auth.user.id}/${this.$route.params.id}`)
    const previousTeamscan = await this.$axios.get(`teamscans/previous/${this.$auth.user.id}/${this.$route.params.id}`)
    const levels = await this.$axios.get(`levels`)
    const dysfunctions = await this.$axios.get(`dysfunctiontranslations/language/${this.$auth.user.preferredLanguageId}`)
    const recommendations = await this.$axios.get(`recommendationtranslations/${2}`)

    this.teamscan = teamscan.data
    this.previousTeamscan = previousTeamscan.data
    this.levels = levels.data
    this.dysfunctions = dysfunctions.data
    this.recommendations = recommendations.data
    await this.getInterpretations(teamscan.data)
    this.isLoading = false
  },
  computed: {
    getBreadcrumbs() {
      return [{ text: this.teamscan.team.name }, { text: this.teamscan.title }]
    },
  },
  methods: {
    async getInterpretations(prop) {
        const baseUrl = `interpretationtranslations/${this.$auth.user.preferredLanguageId}`

        const trustLevelId = this.calculateLevel(prop.scoreTrust).id
        const trustInterpretation = await this.$axios.get(`${baseUrl}/${trustLevelId}/${this.dysfunctions[0].dysfunction.id}`)

        const conflictLevelId = this.calculateLevel(prop.scoreConflict).id
        const conflictInterpretation = await this.$axios.get(`${baseUrl}/${conflictLevelId}/${this.dysfunctions[1].dysfunction.id}`)

        const commitmentLevelId = this.calculateLevel(prop.scoreCommitment).id
        const commitmentInterpretation = await this.$axios.get(`${baseUrl}/${commitmentLevelId}/${this.dysfunctions[2].dysfunction.id}`)

        const accountabilityLevelId = this.calculateLevel(prop.scoreAccountability).id
        const accountabilityInterpretation = await this.$axios.get(`${baseUrl}/${accountabilityLevelId}/${this.dysfunctions[3].dysfunction.id}`)

        const resultsLevelId = this.calculateLevel(prop.scoreResults).id
        const resultsInterpretation = await this.$axios.get(`${baseUrl}/${resultsLevelId}/${this.dysfunctions[4].dysfunction.id}`)

        this.interpretations.push(trustInterpretation.data, conflictInterpretation.data, commitmentInterpretation.data, accountabilityInterpretation.data, resultsInterpretation.data)
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
.toolbar-btn {
  margin-left: 20px;
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
