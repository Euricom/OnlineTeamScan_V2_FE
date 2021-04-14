<template>
  <v-card class="mb-4" elevation="1" @click="redirectTeamDetail">
      <v-row align="center" class="mr-1 ml-1">
        <v-col align="start" cols="12" sm="3" md="3" lg="2">
          <span style="color: #343A40; font-size: 16px;" class="font-weight-medium">{{ team.name}}</span>
        </v-col>
        <v-col align="center" class="pl-15" cols="12" sm="1" md="1" lg="2">
          <span style="color: #343A40; font-size: 16px;">{{ team.teamMembers.length }}</span>
        </v-col>
        <v-col align="center" cols="12" sm="3" md="3" lg="3">
          <span style="color: #343A40; font-size: 16px;">{{ team.lastTeamscan !== null ? formatDate  : '-' }}</span>
        </v-col>
        <v-col align="center" cols="12" sm="3" md="3" lg="3">
          <span :class="team.isTeamscanActive ? 'activeTeamscan' : 'inactiveTeamscan'" style="font-size: 16px;">{{ team.isTeamscanActive ? 'Actief' : 'Niet Actief' }}</span>
        </v-col>
        <v-col align="end" cols="12" sm="2" md="2" lg="2">
          <v-menu
            transition="slide-y-transition"
            left
            bottom
            offset-y
            :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon>
                <v-icon color="#A8A8A8" large>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="startTeamscan">
                <v-icon dense class="menuItemIcon mr-2">mdi-play</v-icon>
                <v-list-item-title>Start Teamscan</v-list-item-title>
              </v-list-item>
              <v-list-item @click="editTeam">
                <v-icon dense class="menuItemIcon mr-2">mdi-pencil</v-icon>
                <v-list-item-title>Bewerken</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteTeam">
                <v-icon dense class="menuItemIcon mr-2">mdi-delete</v-icon>
                <v-list-item-title>Verwijderen</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
  </v-card>
</template>

<script>

export default {
  name: "CustomListItem",
  props: {
    team: {
      type: Object,
      required: true
    },
  },
  computed: {
    formatDate() {
      let date = new Date(this.team.lastTeamscan)
      let day = date.getDate().toString().padStart(2,'0')
      let month = (date.getMonth() + 1).toString().padStart(2,'0')
      let year = date.getFullYear().toString()
      return `${day}/${month}/${year}`
    }
  },
  methods: {
    redirectTeamDetail() {
      this.$router.push({
          path: `/teamdetail/${this.team.id}`
      })
    },
    deleteTeam(){
      this.$parent.deleteTeam(this.team)
    },
    editTeam(){
      this.$parent.editTeam(this.team)
    },
    startTeamscan(){
      this.$parent.setTeamscanActive(this.team)
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
