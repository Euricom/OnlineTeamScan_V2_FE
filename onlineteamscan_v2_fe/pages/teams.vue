<template>
  <div>
    <v-toolbar elevation="0">
      <v-toolbar-title
        class="font-weight-medium"
        style="color: #343A40; font-size: 24px;">
        Teams
      </v-toolbar-title>
      <v-toolbar-title
        class="font-weight-medium ml-1"
        style="color: #A8A8A8; font-size: 24px;">
        ({{ this.teams.length }})
      </v-toolbar-title>
      <v-spacer/>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="custom-green" class="customButtonStyle" depressed>
            <v-icon
              left
              color="white">
              {{ 'mdi-account-multiple-plus' }}
            </v-icon>
            <span style="color: white">Nieuw Team</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-alert
            text
            prominent
            type="error"
            v-if="errorMessage !== ''"
          >
            {{ errorMessage }}
          </v-alert>
          <v-card-text>
            <v-container>
              <v-form v-model="isFormValid" ref="form">
                <v-text-field v-model="editedTeam.name" label="Teamnaam" :rules="nameRules"/>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="!isFormValid">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <div class="mx-5 my-5" v-if="this.teams.length">
    <v-row class="mr-1 ml-1">
      <v-col align="start" lg="2">
        <span @click="sortBy('name')" style="color: #919191; font-size: 20px; cursor: pointer;" class="font-weight-medium">Naam</span>
        <v-icon v-if="sorted === 'name'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-down' : 'mdi-arrow-up'}}</v-icon>
      </v-col>
      <v-col align="center" class="pl-15" lg="2">
        <span @click="sortBy('teamMembers')" style="color: #919191; font-size: 20px; cursor: pointer;" class="font-weight-medium">Aantal Leden</span>
        <v-icon v-if="sorted === 'teamMembers'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-down' : 'mdi-arrow-up'}}</v-icon>
      </v-col>
      <v-col align="center" lg="3">
        <span  @click="sortBy('lastTeamscan')" style="color: #919191; font-size: 20px; cursor: pointer;" class="font-weight-medium">Laatste Teamscan</span>
        <v-icon v-if="sorted === 'lastTeamscan'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-down' : 'mdi-arrow-up'}}</v-icon>
      </v-col>
      <v-col align="center" lg="3">
        <span @click="sortBy('isTeamscanActive')" style="color: #919191; font-size: 20px; cursor: pointer;" class="font-weight-medium">Teamscan Status</span>
        <v-icon v-if="sorted === 'isTeamscanActive'" dense color="#919191">{{ direction === 1 ? 'mdi-arrow-down' : 'mdi-arrow-up'}}</v-icon>
      </v-col>
      <v-col align="center" lg="2"></v-col>
    </v-row>
    </div>
      <v-container v-else style="margin-top: 200px">
          <v-row justify="center">
            <img src="../static/EmptyIcon.svg" width="150px">
          </v-row>
          <v-row justify="center">
            <span style="color: #919191; font-size: 20px" class="font-weight-medium">Geen teams gevonden</span>
          </v-row>
      </v-container>
    <div>
      <custom-list-item class="mx-5 mb-8" v-for="(team, index) in teams" :key="index" :team="team"/>
    </div>

    <v-dialog v-model="deleteDialog" width="unset">
      <v-card>
        <v-card-title class="headline confirmation-card-title">
          Weet u zeker dat u dit team wilt verwijderen?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darkin-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darkin-1" text @click="confirmDeleteTeam">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CustomListItem from "../components/CustomListItem";
import Button from "../components/Button";

export default {
  components: {
    CustomListItem,
    Button,
  },
  data() {
    return {
      teams: [],
      originalTeams: [],
      sorted: '', // Key for sorting the team list
      direction: 0, // Ascending order of sort
      isFormValid: false,
      dialog: false,
      deleteDialog: false,
      dialogIndex: -1,
      originalIndex: -1,
      errorMessage: '',
      editedTeam: {
        name: '',
        teamleaderId: this.$auth.user.id,
      },
      defaultTeam: {
        name: '',
        teamleaderId: this.$auth.user.id,
      },
      nameRules: [
        value => !!value || 'Vereist',
        v => /^[^-\s][ áàíóúéëöüñÄĞİŞȘØøğışÐÝÞðýþa-zA-Z_\s-]*$/.test(v) || 'Moet geldig zijn', /*^[ a-zA-Z\-']+$*/
        v => v.length <= 50 || 'Max 50 characters'
      ],
    }
  },
  async created() {
    await this.$axios.get(`http://localhost:49783/api/teams/teammembers/${this.$auth.user.id}`)
      .then(response => this.teams = response.data).then(() => this.originalTeams = [...this.teams])
      .catch(err => console.log(err))

  },
  watch: {
    deleteDialog (val) {
      val || this.closeDelete()
    },
    dialog (val) {
      val || this.close()
    },
  },
  computed: {
    dialogTitle() {
      return this.dialogIndex === -1 ? 'Team Toevoegen' : 'Team Bewerken'
    }
  },
  methods: {
    sortBy(prop) {
      if (this.sorted === prop && this.direction === -1) {
        this.teams = [...this.originalTeams]
        this.direction = 0
        this.sorted = ''
      }
      else if(this.sorted === prop && this.direction === 1) {
        this.teams.reverse()
        this.direction = -1
      }
      else {
        this.direction = 1
        this.sorted = prop
        this.performSort(prop)
      }
      console.log(this.direction)
    },
    performSort(prop) {
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
    closeDelete() {
      this.deleteDialog = false
      this.errorMessage = ''
      this.$refs.form?.resetValidation();
      this.$nextTick(() => {
        this.editedTeam = Object.assign({}, this.defaultTeam)
        this.dialogIndex = -1
        this.originalIndex = -1
      })
    },
    close() {
      this.dialog = false
      this.errorMessage = ''
      this.$refs.form?.resetValidation();
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
      await this.$axios.delete(`teams/${this.editedTeam.id}`)
        .then(() => { this.teams.splice(this.dialogIndex, 1) })
        .then(() => { this.originalTeams.splice(this.originalIndex, 1) })
        .then(() => this.closeDelete())
        .catch(err => console.log(err))
    },
    editTeam(item) {
      this.dialogIndex = this.teams.indexOf(item)
      this.originalIndex = this.originalTeams.indexOf(item)
      this.editedTeam = Object.assign({}, item)
      this.dialog = true
    },
    async save() {
      if (this.dialogIndex > -1)
      {
        await this.$axios.put(`teams`, this.editedTeam)
          .then((res) => { Object.assign(this.teams[this.dialogIndex], { id: res.data.id, isTeamscanActive: res.data.isTeamscanActive, lastTeamscan: res.data.lastTeamscan, name: res.data.name }) })
          .then(() => { Object.assign(this.originalTeams[this.originalIndex], this.teams[this.dialogIndex]) })
          .then(() => this.close())
          .catch(err => this.errorMessage = err.response.data)
      }
      else
      {
        await this.$axios.post(`teams`, this.editedTeam)
          .then((res) => { this.originalTeams.push(res.data) })
          .then(() => { this.teams = [...this.originalTeams] })
          .then(() => {
            if (this.sorted !== ''){
              this.performSort(this.sorted)
            }
          })
          .then(() => this.close())
          .catch(err => this.errorMessage = err.response.data)
      }
    },
  }
}
</script>

<style scoped>
.customButtonStyle {
  font-weight: normal;
  text-transform: none;
  font-size: 16px;
}
.customButtonStyle:hover {
  color: white;
  background-color: #71BF42;
}
.customButtonStyle:before {
  color: white;
  background-color: #71BF42;
}
.customButtonStyle:after {
  color: white;
  background-color: #71BF42;
}
</style>
