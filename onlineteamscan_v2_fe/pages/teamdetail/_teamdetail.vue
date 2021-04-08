<template>
  <div>

    <v-toolbar elevation="0">
      <v-toolbar-title
        class="font-weight-medium toolbar-title">
        {{ this.team.name }}
      </v-toolbar-title>
    </v-toolbar>
    <div class="div_position" align="center">
        <v-card>
          <v-data-table
          :headers="headers"
          :items="sortActive ? getActiveTeamMembers : getInactiveTeamMembers">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title class="font-weight-medium toolbar-card-title">Leden</v-toolbar-title>
                <v-switch v-model="sortActive" label="Actief" class="switch-position"/>
                <v-spacer></v-spacer>

               <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="custom-green"
                    class="buttonStyle"
                    v-on="on"
                    depressed>
                    Lid Toevoegen
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
                   <v-card-text v-if="checkOwner(editedTeamMember)" class="pb-0">
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
                     <v-btn color="blue darken-1" text @click="close">
                       Cancel
                     </v-btn>
                     <v-btn color="blue darken-1" text @click="save" :disabled="!isFormValid">
                       Save
                     </v-btn>
                   </v-card-actions>
                 </v-card>
               </v-dialog>
                <v-dialog v-model="deleteDialog" width="unset">
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
                      <v-btn color="blue darkin-1" text @click="closeDelete">Cancel</v-btn>
                      <v-btn color="blue darkin-1" text @click="confirmDeleteTeamMember">Ok</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editTeamMember(item)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deleteTeamMember(item)" v-if="checkOwner(item)">
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
  </div>
</template>

<script>
export default {
  name: 'TeamDetail',
  data() {
    return {
      team: {},
      dialog: false,
      deleteDialog: false,
      errorMessage: '',
      isFormValid: false,
      sortActive: true,
      editedTeamMember: {
        email: '',
        firstname: '',
        lastname: '',
        isActive: true,
        teamId: this.$route.params.teamdetail,
      },
      defaultTeamMember: {
        email: '',
        firstname: '',
        lastname: '',
        isActive: true,
        teamId: this.$route.params.teamdetail,
      },
      dialogIndex: -1,
      headers: [
        { text: 'Naam', align: 'start', value: 'lastname', width: '15%' },
        { text: 'Voornaam', value: 'firstname', width: '15%' },
        { text: 'E-mail', value: 'email', width: '25%'},
        { text: 'Actief', value: 'isactive', sortable: false, width: '15%'},
        { text: 'Acties', value: 'actions', sortable: false, width: '5%'},
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
  created() {
    this.$axios.get(`teams/members/${this.$route.params.teamdetail}`).then(res => this.team = res.data).catch(err => console.log(err))
  },
  computed: {
    getActiveTeamMembers() {
      return this.team.teamMembers?.filter(x => x.isActive === true)
    },
    getInactiveTeamMembers() {
      return this.team.teamMembers?.filter(x => x.isActive === false)
    },
    dialogTitle() {
      return this.dialogIndex === -1 ? 'Teamlid Toevoegen' : 'Teamlid Bewerken'
    },
    showSwitch() {
      return this.dialogIndex !== -1
    },
  },
  watch: {
    getActiveTeamMembers (val) {
      val || this.getActiveTeamMembers()
    },
    getInactiveTeamMembers (val) {
      val || this.getInactiveTeamMembers()
    },
    dialog (val) {
      val || this.close()
    },
    deleteDialog (val) {
      val || this.closeDelete()
    },
  },
  methods: {
    checkOwner(item) {
      return item.email !== this.$auth.user.email
    },
    close() {
      this.dialog = false
      this.errorMessage = ''
      this.$refs.form?.resetValidation();
      this.$nextTick(() => {
        this.editedTeamMember = Object.assign({}, this.defaultTeamMember)
        this.dialogIndex = -1
      })
    },
    closeDelete() {
      this.deleteDialog = false
      this.errorMessage = ''
      this.$refs.form?.resetValidation();
      this.$nextTick(() => {
        this.editedTeamMember = Object.assign({}, this.defaultTeamMember)
        this.dialogIndex = -1
      })
    },
    editTeamMember(item) {
      this.dialogIndex = this.team.teamMembers.indexOf(item)
      this.editedTeamMember = Object.assign({}, item)
      this.dialog = true
    },
    deleteTeamMember(item) {
      this.dialogIndex = this.team.teamMembers.indexOf(item)
      this.editedTeamMember = Object.assign({}, item)
      this.deleteDialog = true
    },
    async confirmDeleteTeamMember() {
      await this.$axios.delete(`teammembers/${this.editedTeamMember.id}`)
        .then(() => { this.team.teamMembers.splice(this.dialogIndex, 1) }).then(() => this.closeDelete())
        .catch(err => console.log(err))
    },
    async save() {
      if (this.dialogIndex > -1)
      {
        await this.$axios.put(`teammembers`, this.editedTeamMember)
          .then((res) => { Object.assign(this.team.teamMembers[this.dialogIndex], res.data) }).then(() => this.close())
          .catch(err => this.errorMessage = err.response.data)
      }
      else
      {
        await this.$axios.post(`teammembers`, this.editedTeamMember)
          .then((res) => { this.team.teamMembers.push(res.data) }).then(() => this.close())
          .catch(err => this.errorMessage = err.response.data)
      }
    },
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
.buttonStyle {
  text-transform: none;
  color: #FFFFFF;
  font-weight: normal;
}
.buttonStyle:hover {
  color: white;
  background-color: #71BF42;
}
.buttonStyle:before {
  color: white;
  background-color: #71BF42;
}
.buttonStyle:after {
  color: white;
  background-color: #71BF42;
}
</style>
