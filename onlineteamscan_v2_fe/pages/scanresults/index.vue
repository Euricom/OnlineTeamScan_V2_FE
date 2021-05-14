<template>
    <v-overlay class="select-overlay" color="#B9B9B9" z-index="0" opacity="0.5">
        <v-card light max-width="500px">
          <v-card-title class="card-title">
            Selecteer een teamscan
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col cols="6">
                <v-select label="Team" :items="teams" v-model="selectedTeam" item-text="name" :return-object="true" @input="getTeamscansByTeam()"/>
              </v-col>
              <v-col cols="6">
                <v-select label="Teamscan" :items="teamscans" v-model="selectedTeamscan" item-text="title" :return-object="true"/>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" :disabled="disableValidation" @click="selectTeamscan()">Selecteren</v-btn>
          </v-card-actions>
        </v-card>
    </v-overlay>
</template>

<script>
export default {
  name: "Scanresults",
  data() {
    return {
      teams: [],
      teamscans: [],
      selectedTeam: {},
      selectedTeamscan: {},
    }
  },
  async created() {
    this.teams = await this.$axios.$get(`teams/user/${this.$auth.user.id}`) // REV: Axios $ shortcuts
  },
  computed: {
    disableValidation() {
      return Object.keys(this.selectedTeam).length <= 1 || Object.keys(this.selectedTeamscan).length <= 1;
    },
  },
  methods: {
    async getTeamscansByTeam() {
      this.selectedTeamscan = Object;
      this.teamscans = await this.$axios.get(`teamscans/team/${this.selectedTeam.id}`).data // REV: Or get data one the same line
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
