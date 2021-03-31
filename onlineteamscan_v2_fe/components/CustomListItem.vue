<template>
  <v-card class="mb-4" elevation="1" @click="redirectTeamDetail">
    <v-container>
      <v-row align="center" class="mr-1 ml-1">
        <v-col align="start" cols="12" sm="3" md="3" lg="3">
          <span style="color: #343A40; font-size: 16px;" class="font-weight-medium">{{ team.name}}</span>
        </v-col>
        <v-col align="start" cols="12" sm="1" md="1" lg="1">
          <span style="color: #343A40; font-size: 16px;">{{ team.teamMembers.length }}</span>
        </v-col>
        <v-col align="center" cols="12" sm="3" md="3" lg="3">
          <span style="color: #343A40; font-size: 16px;">{{ team.lastTeamscan !== null ? team.lastTeamscan : '-' }}</span>
        </v-col>
        <v-col align="center" cols="12" sm="3" md="3" lg="3">
          <span :class="team.isTeamscanActive ? 'activeTeamscan' : 'inactiveTeamscan'" style="font-size: 16px;">{{ team.isTeamscanActive ? 'Actief' : 'Niet Actief' }}</span>
        </v-col>
        <v-col align="end" cols="12" sm="2" md="2" lg="2">
          <v-btn icon>
            <v-icon color="#A8A8A8" large>mdi-dots-horizontal</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>

export default {
  name: "CustomListItem",
  components: {

  },
  props: {
    team: {
      type: Object,
      required: true
    },
  },
  data() {
    return {

    }
  },
  methods: {
    redirectTeamDetail() {
      this.$router.push({
          path: `/teamdetail/${this.team.id}`
      })
    },
  },
}
</script>

<style scoped>
  .inactiveTeamscan {
    color: #F95656;
  }

  .activeTeamscan {
    color: #71BF42;
  }
</style>
