<template>
  <div>

    <v-toolbar elevation="0">
      <v-toolbar-title
        class="font-weight-medium"
        style="color: #343A40; font-size: 24px;">
        Scanresultaten
      </v-toolbar-title>
      <v-spacer/>
      <v-breadcrumbs :items="getBreadcrumbs" style="color: #A8A8A8; font-size: 16px" v-if="!overlay">
        <template v-slot:divider>
          <v-icon color="#A8A8A8">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <Button :text="'Selecteer Teamscan'" :icon="'mdi-message-text'" style="margin-left: 20px; font-weight: normal" @click.native="toggleTeamscan(false)"/>
      <Button :text="'Exporteer'" :icon="'mdi-file-download'" style="margin-left: 20px; font-weight: normal"/>
    </v-toolbar>



      <v-container fluid v-if="!overlay" style="margin-top: 5px; padding-left: 15px; padding-right: 15px;">
        <ScoreCard :dysfunctions="dysfunctions" :levels="levels" :scores="this.selectedTeamscan" :previous-teamscan="this.previousTeamscan"/>

        <v-row style="margin-top: 5px;">
          <v-col cols="5">
            <v-row no-gutters style="height: 135%">

              <v-card width="100%" align="center">
                <v-card-title> Interpretatie </v-card-title>
                  <v-row class="full-height">

                    <v-col cols="1">
                        <v-btn icon>
                          <v-icon>
                            mdi-chevron-left
                          </v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="10">

                    </v-col>

                    <v-col cols="1">
                        <v-btn icon>
                          <v-icon>
                            mdi-chevron-right
                          </v-icon>
                        </v-btn>
                    </v-col>

                  </v-row>
              </v-card>

            </v-row>
            <v-row no-gutters style="height: 170%">

              <v-card width="100%" style="margin-top: 15px;">
                <v-card-title> Individuele Resultaten </v-card-title>
              </v-card>

        </v-row>
          </v-col>

          <v-col cols="7">
            <v-card style="height: 305%">
              <v-card-title> Vooruitgang </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    <v-overlay
      z-index="0"
      color="#B9B9B9"
      opacity="0.5"
      :value="overlay">
      <v-card light>
        <v-card-title style="font-size: 24px">
          Selecteer een teamscan
        </v-card-title>
        <v-container fluid>
          <v-row align="center">
            <v-col cols="6">
              <v-select label="Team" :items="teams" item-text="name" v-model="selectedTeam" :return-object="true" @input="getTeamscansByTeam()"/>
            </v-col>
            <v-col cols="6">
              <v-select label="Teamscan" :items="teamscans" item-text="title" v-model="selectedTeamscan" :return-object="true"/>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            :disabled="disableValidation"
            @click="toggleTeamscan(true)">
            Selecteren
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

  </div>
</template>

<script>
import Button from "@/components/Button";
export default {
  name: 'ScanResultaten',
  components: {
    Button,
  },
  data() {
    return {
      overlay: true,
      teams: [],
      teamscans: [],
      levels: [],
      dysfunctions: [],
      interpretations: [],
      selectedTeam: {
        type: Object,
      },
      selectedTeamscan: {
        type: Object,
      },
      previousTeamscan: {
        type: Object
      },
    }
  },
  computed: {
    getBreadcrumbs() {
      return [
        {
          text: this.selectedTeam.name,
        },
        {
          text: this.selectedTeamscan.title,
        },
      ]
    },
    disableValidation() {
      return Object.keys(this.selectedTeam).length <= 1 || Object.keys(this.selectedTeamscan).length <= 1;
    },
  },
  methods: {
    getTeamscansByTeam() {
      this.selectedTeamscan = Object;
      this.$axios.get(`teamscans/team/${this.selectedTeam.id}`).then(res => this.teamscans = res.data).catch(err => console.log(err))
    },
    async toggleTeamscan(boolean) {
      if (boolean) {
        await this.$axios.get(`teamscans/previous/${this.selectedTeamscan.id}`).then(res => this.previousTeamscan = res.data).catch(err => console.log(err))
      }
      this.overlay = !this.overlay;
    },
  },
  created() {
    this.$axios.get(`teams`).then(res => this.teams = res.data).catch(err => console.log(err))
    this.$axios.get(`levels`).then(res => this.levels = res.data).catch(err => console.log(err))
    this.$axios.get(`dysfunctiontranslations/language/${1}`).then(res => this.dysfunctions = res.data).catch(err => console.log(err))
  }
}
</script>

<style scoped>

</style>
