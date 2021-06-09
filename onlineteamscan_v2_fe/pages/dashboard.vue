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
            <span @click="sortBy('name')" class="font-weight-medium sort-header">Naam</span>
            <v-icon v-if="sorted === 'name'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-up' : 'mdi-arrow-down'}}</v-icon>
          </v-col>
          <v-col align="center" lg="4">
            <span  @click="sortBy('lastTeamscan')" class="font-weight-medium sort-header">Laatste Teamscan</span>
            <v-icon v-if="sorted === 'lastTeamscan'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-up' : 'mdi-arrow-down'}}</v-icon>
          </v-col>
          <v-col align="center" lg="4">
            <span @click="sortBy('teamStatus')" class="font-weight-medium sort-header">Teamscan Status</span>
            <v-icon v-if="sorted === 'teamStatus'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-up' : 'mdi-arrow-down'}}</v-icon>
          </v-col>
        </v-row>
      </div>
      <div>
        <ActiveTeam v-for="(team, index) in teams" :key="index" :team="team"/>
      </div>
    </div>
    <div v-else>
      <h1>TEST</h1>
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
      originalTeams: [],
      sorted: '',
      direction: 0,
    }
  },
  async created() {
    const teams = await this.$axios.get(`teams/teamscans/${this.$auth.user.id}`)

    this.teams = teams.data
    this.originalTeams = [...this.teams]
    this.isLoading = false
  },
  methods: {
    sortBy(prop) {
      if (this.sorted !== prop) return this.defaultSort(prop)
      if (this.direction === 1) return this.reverseSort()
      return this.unsort()
    },
    unsort() {
      this.teams = [...this.originalTeams]
      this.direction = 0
      this.sorted = ''
    },
    reverseSort() {
      this.teams.reverse()
      this.direction = -1
    },
    defaultSort(prop) {
      this.direction = 1
      this.sorted = prop
      switch (prop) {
        case 'name':
          this.teams.sort((a, b) =>  a[this.sorted].length - b[this.sorted].length)
          break
        case 'lastTeamscan':
          this.teams.sort((a, b) =>  new Date(a[this.sorted]) - new Date(b[this.sorted]))
          break
        case 'teamStatus':
          this.teams.sort((a, b) =>  a[this.sorted] - b[this.sorted])
          break
        default:
          this.teams.sort((a, b) =>  a[this.sorted].localeCompare(b[this.sorted]))
          break
      }
    }
  }
}
</script>

<style>
.sort-header {
  color: #919191;
  font-size: 16px;
  cursor: pointer;
}
</style>
