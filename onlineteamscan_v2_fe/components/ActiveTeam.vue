<template>
  <div class="ma-5">
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-row align="center">
          <v-col align="start" cols="12" sm="4" md="4" lg="4">
            <span style="color: #343A40; font-size: 16px;" class="font-weight-medium">{{ team.name}}</span>
          </v-col>
          <v-col align="center" cols="12" sm="4" md="4" lg="4">
            <span style="color: #343A40; font-size: 16px;">{{ team.lastTeamscan !== null ? formatDate(team.lastTeamscan)  : '-' }}</span>
          </v-col>
          <v-col align="center" cols="12" sm="4" md="4" lg="4" class="teamscan-status">
            <v-progress-linear class="progress-bar"
              v-model="progress"
              :color="getProgressColor"
            ></v-progress-linear>
            <span class="progress-percentage">{{progress}}%</span>
          </v-col>
        </v-row>
        <template v-slot:actions>
          <v-icon>
            $expand
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { globalMixin } from '@/mixins/globalMixin'

export default {
  name: "ActiveTeam.vue",
  mixins: [globalMixin],
  props: {
    team: {
      type: Object,
      required: true
    },
  },
  data(){
    return {
      teamscanMembers: [],
      nonAnsweredTeamscanMembers: [],
      hasAnsweredTeamscanMembers: [],
      progress: ''
    }
  },
  computed: {
    getProgressColor() {
      if (this.progress === 100) return "#93EB5F"
      if (this.progress === 0) return "#F95656"
      return "#FFD54A"
    }
  },
  async created() {
    this.teamscanMembers = (await this.$axios.get(`individualscores/members/${this.team.teamscans.lastItem.id}`)).data
    this.nonAnsweredTeamscanMembers = [...this.teamscanMembers].filter(teamscanmember => teamscanmember.hasAnswered === false)
    this.nonAnsweredTeamscanMembers = [...this.teamscanMembers].filter(teamscanmember => teamscanmember.hasAnswered === true)
    this.progress = this.calculatePercentage(this.nonAnsweredTeamscanMembers.length, this.teamscanMembers.length)
  },
  methods: {
    calculatePercentage(amount, totalAmount) {
      return (amount/totalAmount)*100
    }
  }
}
</script>

<style>
.teamscan-status {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.progress-percentage {
  padding-left: 5px;
}
.progress-bar {
  max-width: 50%;
}
</style>
