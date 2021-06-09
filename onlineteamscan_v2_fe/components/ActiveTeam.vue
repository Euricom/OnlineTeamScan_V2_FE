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
              :value="progress"
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
        <v-card>
          <v-card-title>
            Leden
          </v-card-title>
          <v-data-table
            no-data-text="Geen teamleden gevonden"
            :headers="headersTeammembers"
            :hide-default-footer="true"
            :items="this.teamscanMembers">
            <template v-slot:item.hasAnswered="{ item }">
                <p v-if="item.hasAnswered === false" class="nonAnswered mb-0">Onbeantwoord</p>
                <p v-else class="answered mb-0">Beantwoord</p>
            </template>
            <template v-slot:item.teamMember.email="{ item }">
              <div v-if="item.hasAnswered === false">
                <v-icon class="v-icon-style" v-if="item.teamMember.email !== $auth.user.email">
                  mdi-bell-ring
                </v-icon>
                <v-icon class="v-icon-style" @click="" v-else>
                  mdi-pencil
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </v-card>
        <v-btn v-if="progress === 100" color="custom-green" class="custom-static-btn button-detail mt-4" @click="" depressed>
          <v-icon
            left
            color="white">
            mdi-account-multiple-plus
          </v-icon>
          <span class="custom-text-btn">Nieuw Team</span>
        </v-btn>
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
      progress: '',
      headersTeammembers: [
        { text: 'Naam', align: 'start', value: 'teamMember.firstname', width: '30%'},
        { text: 'Voornaam', value: 'teamMember.lastname', width: '20%'},
        { text: 'Status', value: 'hasAnswered', width: '35%', align: 'center', sortable: false},
        { text: 'Acties', value: 'teamMember.email', width: '15%', align: 'center', sortable: false},
      ],
    }
  },
  computed: {
    getProgressColor() {
      if (this.progress === 100) return "#93EB5F"
      if (this.progress === 0) return "#F95656"
      return "#FFD54A"
    },
  },
  async created() {
    this.teamscanMembers = (await this.$axios.get(`individualscores/members/${this.team.teamscans.lastItem.id}`)).data
    this.nonAnsweredTeamscanMembers = [...this.teamscanMembers].filter(teamscanmember => teamscanmember.hasAnswered === false)
    this.progress = this.calculatePercentage(this.nonAnsweredTeamscanMembers.length, this.teamscanMembers.length)
  },
  methods: {
    calculatePercentage(amount, totalAmount) {
      return Math.round(((totalAmount-amount)/totalAmount)*100)
    },
    navigateDetail() {
      this.$router.push({
        path: `/scanresults/${this.team.teamscans.lastItem.id}`
      })
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
.answered {
  color: #93EB5F;
}
.nonAnswered {
  color: #F95656;
}
.button-detail {
  float: right;
}
</style>
