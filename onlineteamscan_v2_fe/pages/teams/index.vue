<template>
  <div v-if="!isLoading">
    <v-toolbar elevation="0">
      <v-toolbar-title
        class="font-weight-medium toolbar-title">
        Teams
      </v-toolbar-title>
      <v-toolbar-title
        class="font-weight-medium ml-1 toolbar-title-count">
        ({{ this.teams.length }})
      </v-toolbar-title>
      <v-spacer/>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="custom-green" class="custom-static-btn" depressed>
            <v-icon
              left
              color="white">
              mdi-account-multiple-plus
            </v-icon>
            <span class="new-team-icon">Nieuw Team</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-alert
            text
            dense
            type="error"
            v-if="errorMessage !== ''"
          >
            {{ errorMessage }}
          </v-alert>
          <v-card-text class="pb-0">
            <v-container>
              <v-form v-model="isFormValid" ref="form">
                <v-text-field v-model="editedTeam.name" label="Teamnaam" :rules="teamNameRules"/>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">
              Cancel
            </v-btn>
            <v-btn :loading="loading" color="blue darken-1" text @click="save" :disabled="!isFormValid">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <div class="mx-5 my-5" v-if="this.teams.length">
    <v-row class="mr-1 ml-1">
      <v-col align="start" lg="2">
        <span @click="sortBy('name')" class="font-weight-medium sort-header">Naam</span>
        <v-icon v-if="sorted === 'name'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-up' : 'mdi-arrow-down'}}</v-icon>
      </v-col>
      <v-col align="center" class="pl-15" lg="2">
        <span @click="sortBy('teamMembers')" class="font-weight-medium sort-header">Aantal Leden</span>
        <v-icon v-if="sorted === 'teamMembers'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-up' : 'mdi-arrow-down'}}</v-icon>
      </v-col>
      <v-col align="center" lg="3">
        <span  @click="sortBy('lastTeamscan')" class="font-weight-medium sort-header">Laatste Teamscan</span>
        <v-icon v-if="sorted === 'lastTeamscan'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-up' : 'mdi-arrow-down'}}</v-icon>
      </v-col>
      <v-col align="center" lg="3">
        <span @click="sortBy('isTeamscanActive')" class="font-weight-medium sort-header">Teamscan Status</span>
        <v-icon v-if="sorted === 'isTeamscanActive'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-up' : 'mdi-arrow-down'}}</v-icon>
      </v-col>
      <v-col align="center" lg="2"></v-col>
    </v-row>
    </div>
      <v-container v-else class="empty-teams-container">
          <v-row justify="center">
            <img src="../../static/EmptyIcon.svg" class="empty-teams-img">
          </v-row>
          <v-row justify="center">

            <span class="font-weight-medium not-found-header">Geen teams gevonden</span>
          </v-row>
      </v-container>
    <div>
      <custom-list-item class="mx-5 mb-8" v-for="(team, index) in teams" :key="index" :team="team"/>
    </div>

    <v-dialog v-model="deleteDialog" width="unset">
      <v-card>
        <v-card-title>
          <span class="headline confirmation-card-title">
            Verwijderen
          </span>
        </v-card-title>
        <v-card-text class="pb-0">
          Weet u zeker dat u dit team wilt verwijderen?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darkin-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn :loading="loading" color="blue darkin-1" text @click="confirmDeleteTeam">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false" color="custom-green">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import CustomListItem from "../../components/CustomListItem";

export default {
  components: {
    CustomListItem,
  },
  data() {
    return {
      isLoading: true,
      loading: false,
      teams: [],
      originalTeams: [],
      sorted: '',
      direction: 0,
      isFormValid: false,
      dialog: false,
      deleteDialog: false,
      dialogIndex: -1,
      originalIndex: -1,
      errorMessage: '',
      snackbar: false,
      snackbarMessage: '',
      editedTeam: {
        name: '',
        teamleaderId: this.$auth.user.id,
      },
      defaultTeam: {
        name: '',
        teamleaderId: this.$auth.user.id,
      },
      teamNameRules: [
        nameRequired => !!nameRequired || 'Vereist',
        nameValidCharacters => /^[^-\s][ áàíóúéëöüñÄĞİŞȘØøğışÐÝÞðýþa-zA-Z_\s-]*$/.test(nameValidCharacters) || 'Moet geldig zijn',
        nameValidLength => nameValidLength.length <= 50 || 'Max 50 characters'
      ],
    }
  },
  async created() {
    const result = await this.$axios.get(`teams/teammembers/${this.$auth.user.id}`)
    this.teams = result.data
    this.originalTeams = [...this.teams]
    this.isLoading = false
  },
  watch: {
    deleteDialog (val) {
      val || this.closeDialog()
    },
    dialog (val) {
      val || this.closeDialog()
    },
  },
  computed: {
    dialogTitle() {
      return this.dialogIndex === -1 ? 'Team Toevoegen' : 'Team Bewerken'
    }
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
        case 'teamMembers':
          this.teams.sort((a, b) =>  a[this.sorted].length - b[this.sorted].length)
          break
        case 'lastTeamscan':
          this.teams.sort((a, b) =>  new Date(a[this.sorted]) - new Date(b[this.sorted]))
          break
        case 'isTeamscanActive':
          this.teams.sort((a, b) =>  a[this.sorted] - b[this.sorted])
          break
        default:
          this.teams.sort((a, b) =>  a[this.sorted].localeCompare(b[this.sorted]))
          break
      }
    },
    closeDialog() {
      this.$refs.form?.resetValidation();
      this.dialog = false
      this.deleteDialog = false
      this.errorMessage = ''
      this.$nextTick(() => {
        this.editedTeam = Object.assign({}, this.defaultTeam)
        this.dialogIndex = -1
        this.originalIndex = -1
      })
    },
    deleteTeam(item) {
      this.dialogIndex = this.teams.indexOf(item)
      this.originalIndex = this.originalTeams.indexOf(item)
      this.editedTeam = Object.assign({}, item)
      this.deleteDialog = true
    },
    async confirmDeleteTeam() {
      this.loading = true
      await this.$axios.delete(`teams/${this.editedTeam.id}`)
      this.teams.splice(this.dialogIndex, 1)
      this.originalTeams.splice(this.originalIndex, 1)
      this.closeDialog()
      this.loading = false
    },
    editTeam(item) {
      this.dialogIndex = this.teams.indexOf(item)
      this.originalIndex = this.originalTeams.indexOf(item)
      this.editedTeam = Object.assign({}, item)
      this.dialog = true
    },
    async setTeamscanActive(item) {
      const teamIndex = this.teams.indexOf(item)
      const originalTeamIndex = this.originalTeams.indexOf(item)

      try {
        const result = await this.$axios.post(`teamscans/${item.teamleaderId}/${item.id}`)
        const updatedTeamProperties = { name: result.data.name, lastTeamscan: result.data.lastTeamscan, isTeamscanActive: result.data.isTeamscanActive}
        Object.assign(this.teams[teamIndex], updatedTeamProperties)
        Object.assign(this.originalTeams[originalTeamIndex], this.teams[teamIndex])
        this.snackbarMessage = "Teamscan gestart"
      }
      catch(err) {
        this.errorMessage = err.response.data
        this.snackbarMessage = "Teamscan kan niet gestart worden"
      }
      this.snackbar = true
    },
    save() {
      if (this.dialogIndex > -1)
        this.updateTeam()
      else
        this.addTeam()
    },
    async addTeam() {
      try {
        this.loading = true
        const result = await this.$axios.post(`teams`, this.editedTeam)
        this.originalTeams.push(result.data)
        this.teams = [...this.originalTeams]

        if (this.sorted !== '') this.defaultSort(this.sorted)

        this.closeDialog();
      }
      catch(err) {
        this.errorMessage = err.response.data
      }
      this.loading = false
    },
    async updateTeam() {
      try {
        this.loading = true
        const result = await this.$axios.put(`teams`, this.editedTeam)
        const newTeam = { id: result.data.id, name: result.data.name }
        Object.assign(this.teams[this.dialogIndex], newTeam)
        Object.assign(this.originalTeams[this.originalIndex], this.teams[this.dialogIndex])
        this.closeDialog()
      }
      catch(err) {
          this.errorMessage = err.response.data
      }
      this.loading = false
    },
  }
}
</script>

<style scoped>
.toolbar-title {
  color: #343A40;
  font-size: 24px;
}
.toolbar-title-count {
  color: #A8A8A8;
  font-size: 24px;
}
.sort-header {
  color: #919191;
  font-size: 16px;
  cursor: pointer;
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
