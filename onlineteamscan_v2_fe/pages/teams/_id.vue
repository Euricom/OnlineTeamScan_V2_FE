<template>
  <div v-if="!isLoading">
    <v-toolbar elevation="0">
      <v-toolbar-title
        class="font-weight-medium toolbar-title test">
        {{ this.team.name }}
        <span class="font-weight-medium sub-toolbar-title">Laatste Teamscan: {{ getTeamLatestTeamscan }}</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn color="custom-green toolbar-btn" class="custom-static-btn" depressed>
        <v-icon
          left
          color="white">
          mdi-play
        </v-icon>
        <span class="custom-text-btn">Start Teamscan</span>
      </v-btn>
      <v-btn color="custom-green toolbar-btn" class="custom-static-btn" depressed>
        <v-icon
          left
          color="white">
          mdi-pencil
        </v-icon>
        <span class="custom-text-btn">Bewerk Team</span>
      </v-btn>

      <v-dialog v-model="deleteTeamDialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="custom-green toolbar-btn" class="custom-static-btn" depressed>
            <v-icon
              left
              color="white">
              mdi-delete
            </v-icon>
            <span class="custom-text-btn">Verwijder Team</span>
          </v-btn>
        </template>
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

    </v-toolbar>
    <div class="div_position" align="center">
        <v-card>
          <v-data-table
          :headers="headersTeamMembers"
          :items="sortActive ? getActiveTeamMembers : getInactiveTeamMembers">
            <template v-slot:top>
              <v-toolbar flat class="rounded">
                <v-toolbar-title class="font-weight-medium toolbar-card-title">Leden</v-toolbar-title>
                <v-switch v-model="sortActive" label="Actief" class="switch-position"/>
                <v-spacer></v-spacer>

               <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="custom-green"
                    class="custom-static-btn"
                    v-on="on"
                    depressed>
                    <span class="custom-text-btn">Lid Toevoegen</span>
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
                   <v-card-text v-if="checkOwner(selectedEmail)" class="pb-0">
                     <v-container class="pb-0">
                       <v-form v-model="isFormValid" ref="form">
                       <v-text-field v-model="editedTeamMember.email" label="E-mail" :rules="emailRules"/>
                       <v-text-field v-model="editedTeamMember.firstname" label="Voornaam" :rules="nameRules"/>
                       <v-text-field v-model="editedTeamMember.lastname" label="Achternaam" :rules="nameRules"/>
                       <v-switch v-model="editedTeamMember.isActive" label="Actief" v-if="showSwitch" />
                       </v-form>
                     </v-container>
                   </v-card-text>

                   <v-card-text v-else class="pb-0">
                       <v-form v-model="isFormValid" ref="form">
                         <v-switch v-model="editedTeamMember.isActive" label="Actief" v-if="showSwitch" />
                       </v-form>
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
                <v-dialog v-model="deleteMemberDialog" width="unset">
                  <v-card>
                    <v-card-title>
                      <span class="headline confirmation-card-title">
                        Verwijderen
                      </span>
                    </v-card-title>
                    <v-card-text class="pb-0">
                      Weet u zeker dat u dit teamlid wilt verwijderen?
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darkin-1" text @click="closeDialog">Cancel</v-btn>
                      <v-btn :loading="loading" color="blue darkin-1" text @click="confirmDeleteTeamMember">Ok</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editTeamMember(item)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deleteTeamMember(item)" v-if="checkOwner(item.email)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:item.isactive="{ item }">
              <v-icon color="#71BF42" class="v-icon-style" v-if="item.isActive === true">
                mdi-checkbox-marked
              </v-icon>
              <v-icon color="#B9B9B9" class="v-icon-style" v-else>
                mdi-checkbox-blank-outline
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
    </div>
    <div class="div_position" align="center">
      <v-card>
        <v-card-title>
          Teamscans
        </v-card-title>
        <v-data-table @click:row="goToTeamscanResult"
          :sort-by="'title'"
          :sort-desc="true"
          :headers="headersTeamscans"
          :items="team.teamscans"
        ><template
          v-for="header in headersTeamscans.filter((header) =>
                header.hasOwnProperty('formatter')
              )"
          v-slot:[`item.${header.value}`]="{ header, value }"
        >
          {{ header.formatter(value) }}
        </template>
        </v-data-table>
      </v-card>
    </div>
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
import { globalMixin } from '@/mixins/globalMixin'

export default {
  name: 'TeamDetail',
  components: [
    globalMixin,
  ],
  data() {
    return {
      isLoading: true,
      loading: false,
      team: {},
      dialog: false,
      deleteMemberDialog: false,
      deleteTeamDialog: false,
      editTeamDialog: false,
      startTeamscanDialog: false,
      errorMessage: '',
      snackbarMessage: '',
      snackbar: false,
      isFormValid: false,
      sortActive: true,
      editedTeamMember: {
        email: '',
        firstname: '',
        lastname: '',
        isActive: true,
        teamId: this.$route.params.id,
      },
      selectedEmail: '',
      defaultTeamMember: {
        email: '',
        firstname: '',
        lastname: '',
        isActive: true,
        teamId: this.$route.params.id,
      },
      dialogIndex: -1,
      headersTeamMembers: [
        { text: 'Naam', align: 'start', value: 'lastname', width: '15%' },
        { text: 'Voornaam', value: 'firstname', width: '15%' },
        { text: 'E-mail', value: 'email', width: '25%'},
        { text: 'Actief', value: 'isactive', sortable: false, width: '15%'},
        { text: 'Acties', value: 'actions', sortable: false, width: '5%'},
      ],
      headersTeamscans: [
        { text: 'Titel', align: 'start', value: 'title', width: '25%' },
        { text: 'Gestart door', value: 'startedBy', width: '25%', formatter: this.formatName },
        { text: 'Startdatum', value: 'startDate', width: '25%', formatter: this.formatDate },
        { text: 'Einddatum', value: 'endDate', width: '25%', align: 'center', formatter: this.formatDate},
      ],
      emailRules: [
        value => !!value || 'Vereist',
        v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Moet een geldig email adress zijn',
      ],
      nameRules: [
        value => !!value || 'Vereist',
        v => /^[^-\s][ áàíóúéëöüñÄĞİŞȘØøğışÐÝÞðýþa-zA-Z_\s-]*$/.test(v) || 'Moet geldig zijn',
        v => v.length <= 70 || 'Max 70 characters'
      ],
    }
  },
  async created() {
    const result = await this.$axios.get(`teams/full/${this.$auth.user.id}/${this.$route.params.id}`)
    this.team = result.data
    this.isLoading = false
  },
  computed: {
    getActiveTeamMembers() {
      return this.team.teamMembers ? this.team.teamMembers.filter(teamMember => teamMember.isActive === true) : []
    },
    getTeamLatestTeamscan() {
      return this.team.lastTeamscan ? this.formatDate(this.team.lastTeamscan) : ''
    },
    getInactiveTeamMembers() {
      return this.team.teamMembers ? this.team.teamMembers.filter(teamMember => teamMember.isActive === false) : []
    },
    dialogTitle() {
      return this.dialogIndex === -1 ? 'Teamlid Toevoegen' : 'Teamlid Bewerken'
    },
    showSwitch() {
      return this.dialogIndex !== -1
    },
  },
  watch: {
    dialog (val) {
      val || this.closeDialog()
    },
    deleteDialog (val) {
      val || this.closeDialog()
    },
  },
  methods: {
    checkOwner(email) {
      return email !== this.$auth.user.email
    },
    closeDialog() {
      this.$refs.form?.resetValidation();
      this.dialog = false
      this.deleteMemberDialog = false
      this.deleteTeamDialog = false
      this.errorMessage = ''
      this.$nextTick(() => {
        this.editedTeamMember = Object.assign({}, this.defaultTeamMember)
        this.dialogIndex = -1
        this.selectedEmail = ''
      })
    },
    editTeamMember(item) {
      this.dialogIndex = this.team.teamMembers.indexOf(item)
      this.editedTeamMember = Object.assign({}, item)
      this.selectedEmail = this.editedTeamMember.email
      this.dialog = true
    },
    deleteTeamMember(item) {
      this.dialogIndex = this.team.teamMembers.indexOf(item)
      this.editedTeamMember = Object.assign({}, item)
      this.deleteMemberDialog = true
    },
    async confirmDeleteTeamMember() {
      this.loading = true
      try{
        await this.$axios.delete(`teammembers/${this.editedTeamMember.id}`)
        this.team.teamMembers.splice(this.dialogIndex, 1)
      }catch (error)
      {
        this.snackbarMessage = 'Het teamlid kon niet verwijderd worden, probeer later opnieuw'
        this.snackbar = true
      }
      this.closeDialog()
      this.loading = false
    },
    async confirmDeleteTeam() {
      this.loading = true
      try{
        await this.$axios.delete(`teams/${this.team.id}`)
        this.$router.back()
      }catch (error)
      {
        this.closeDialog()
        this.snackbarMessage = 'Het team kon niet verwijderd worden, probeer later opnieuw'
        this.snackbar = true
      }
      this.loading = false
    },
    save() {
      if (this.dialogIndex > -1)
        this.updateTeamMember()
      else
        this.addTeamMember()
    },
    async addTeamMember() {
      try {
        this.loading = true
        const result = await this.$axios.post(`teammembers`, this.editedTeamMember)
        this.team.teamMembers.push(result.data)
        this.closeDialog()
      }
      catch(err) {
        this.errorMessage = err.response.data
      }
      this.loading = false
    },
    async updateTeamMember() {
      try {
        this.loading = true
        const result = await this.$axios.put(`teammembers`, this.editedTeamMember)
        Object.assign(this.team.teamMembers[this.dialogIndex], result.data)
        this.closeDialog()
      }
      catch(err) {
        this.errorMessage = err.response.data
      }
      this.loading = false
    },
    formatDate(value) {
      if (value === null) return '-'
      let date = new Date(value)
      let day = date.getDate().toString().padStart(2,'0')
      let month = (date.getMonth() + 1).toString().padStart(2,'0')
      let year = date.getFullYear().toString()
      return `${day}/${month}/${year}`
    },
    formatName(value) {
      return `${value.firstname} ${value.lastname}`
    },
    goToTeamscanResult(item){
      if(item.endDate !== null) {
        this.$router.push(`/scanresults/${item.id}`)
      }
      else {
        this.snackbarMessage = 'De teamscan is nog niet voltooid'
        this.snackbar = true
      }
    }
  },
}
</script>

<style scoped>
.div_position {
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
}
.toolbar-title {
  color: #343A40;
  font-size: 24px;
}
.toolbar-card-title {
  color: #343A40;
  font-size: 20px;
}
.switch-position {
  margin-top: 23px;
  margin-left: 20px;
}
.v-icon-style {
  margin-left: 3px;
}
.confirmation-card-title {
  word-break: normal;
}
.test {
  display: flex;
  flex-direction: column;
}
</style>
