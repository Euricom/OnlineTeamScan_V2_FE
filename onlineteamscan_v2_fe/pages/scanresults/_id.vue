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
            <v-card width="100%" align="center">
              <v-card-title>Interpretatie</v-card-title>
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

export default {
  name: "Scanresults",
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
    this.isLoading = false
  },
  computed: {
    getBreadcrumbs() {
      return [{ text: this.teamscan.team.name }, { text: this.teamscan.title }]
    },
    isSmallScreen() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
    },
  },
  methods: {
    redirectToSelectTeamscan() {
      this.$router.push({
        path: `/scanresults`
      })
    },
    getRecommendationsByDysfunction(dysfunctionId) {
      return this.recommendations.filter(recommendation => recommendation.recommendation.dysfunctionId === dysfunctionId)
    },
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
  margin-top: 17px;
}
.first-row {
  height: 28vh;
}
.second-row {
  height: 28vh;
}
.first-column {
  padding-right: 7px;
}
.second-column {
  padding-left: 10px;
}
.progress-card {
  height: 56vh;
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
