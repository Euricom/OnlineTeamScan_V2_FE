<template>
  <div v-if="!isLoading">
    <v-toolbar elevation="0">
      <v-toolbar-title
        class="font-weight-medium toolbar-title">
        Dashboard
      </v-toolbar-title>
    </v-toolbar>
    <div v-if="teams.length !== 0">
      <div class="ml-11 mr-13 mt-11">
        <v-row class="mr-1">
          <v-col align="start" lg="4">
            <span class="font-weight-medium sort-header">Naam</span>
          </v-col>
          <v-col align="center" lg="4">
            <span  class="font-weight-medium sort-header">Laatste Teamscan</span>
          </v-col>
          <v-col align="center" lg="4">
            <span class="font-weight-medium sort-header">Teamscan Status</span>
          </v-col>
        </v-row>
      </div>
      <div>
        <ActiveTeam v-for="(team, index) in teams" :key="index" :team="team"/>
      </div>
    </div>
    <div v-else>
      <v-container class="empty-teams-container">
        <v-row justify="center">
          <img src="../static/EmptyIcon.svg" class="empty-teams-img">
        </v-row>
        <v-row justify="center">

          <span class="font-weight-medium not-found-header">Geen teams gevonden</span>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import ActiveTeam from "../components/ActiveTeam";

export default {
  components: {
    ActiveTeam
  },
  data () {
    return {
      isLoading: true,
      teams: [],
    }
  },
  async created() {
    const teams = await this.$axios.get(`teams/teamscans/sorted/${this.$auth.user.id}`)

    this.teams = teams.data
    this.isLoading = false
  },
  methods: {


  }
}
</script>

<style>
.sort-header {
  color: #919191;
  font-size: 16px;
}
.empty-teams-container {
  margin-top: 200px;
}
.empty-teams-img {
  width: 150px;
}
.not-found-header {
  color: #919191;
  font-size: 16px;
}
</style>
