<template>
  <div v-if="!isLoading">
    <v-overlay class="select-overlay" color="#B9B9B9" z-index="0" opacity="0.5">
        <v-card light max-width="500px">
          <v-card-title class="card-title">
            Selecteer een teamscan
          </v-card-title>
          <v-card-text>
            <v-row align="center" v-if="this.teams.length !== 0">
              <v-col cols="6">
                <v-select no-data-text="Geen teams gevonden" label="Team" :items="teams" v-model="selectedTeam" item-text="name" :return-object="true" @input="getTeamscansByTeam()"/>
              </v-col>
              <v-col cols="6">
                <v-select no-data-text="Geen teamscans gevonden" label="Teamscan" :items="teamscans" v-model="selectedTeamscan" item-text="title" :return-object="true"/>
              </v-col>
            </v-row>
              <span v-else>Geen teams gevonden. Maak eerst een team aan.</span>
          </v-card-text>
          <v-card-actions v-if="this.teams.length !== 0">
            <v-spacer></v-spacer>
            <v-btn text color="primary" :disabled="disableValidation" @click="selectTeamscan()">Selecteren</v-btn>
          </v-card-actions>
        </v-card>
    </v-overlay>
  </div>
</template>

<script>
export default {
  name: "Scanresults",
  data() {
    return {
      isLoading: true,
      teams: [],
      teamscans: [],
      selectedTeam: {},
      selectedTeamscan: {},
    }
  },
  async created() {
    const teams = await this.$axios.get(`teams/user/${this.$auth.user.id}`)
    this.teams = teams.data
    this.isLoading = false
  },
  computed: {
    disableValidation() {
      return Object.keys(this.selectedTeam).length <= 1 || Object.keys(this.selectedTeamscan).length <= 1;
    },
  },
  methods: {
    async getTeamscansByTeam() {
      this.selectedTeamscan = Object;
      const teamscans = await this.$axios.get(`teamscans/team/${this.selectedTeam.id}`)
      this.teamscans = teamscans.data
    },
    selectTeamscan() {
      this.$router.push({
        path: `/scanresults/${this.selectedTeamscan.id}`
      })
    },
  },
}
</script>

<style scoped>
.select-overlay {
  position: absolute;
}
.card-title {
  font-size: 24px;
}
</style>
