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



      <v-container v-if="!overlay" style="margin-top: 5px; padding-left: 15px; padding-right: 15px;">
            <v-card align="center">
              <v-container>
                <v-layout>
                  <v-flex><CircularScore :item="trust"/></v-flex>
                  <v-divider vertical class="dividerStyle"/>
                  <v-flex><CircularScore :item="conflict"/></v-flex>
                  <v-divider vertical class="dividerStyle"/>
                  <v-flex><CircularScore :item="commitment"/></v-flex>
                  <v-divider vertical class="dividerStyle"/>
                  <v-flex><CircularScore :item="accountability"/></v-flex>
                  <v-divider vertical class="dividerStyle"/>
                  <v-flex><CircularScore :item="results"/></v-flex>
                </v-layout>
              </v-container>
            </v-card>

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
        <v-container>
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
export default {
  name: 'ScanResultaten',
  components: {
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
      trust: null,
      conflict: null,
      commitment: null,
      accountability: null,
      results: null,
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
    getTrust() {
      let level = this.calculateLevel(this.selectedTeamscan?.scoreTrust);
      return {
        "score": this.selectedTeamscan?.scoreTrust,
        "previousScore": this.previousTeamscan?.scoreTrust,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[0].id,
          "name": this.dysfunctions[0].name
        },
      };
    },
    getConflict() {
      let level = this.calculateLevel(this.selectedTeamscan?.scoreConflict);
      return {
        "score": this.selectedTeamscan?.scoreConflict,
        "previousScore": this.previousTeamscan?.scoreConflict,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[1].id,
          "name": this.dysfunctions[1].name
        },
      };
    },
    getCommitment() {
      let level = this.calculateLevel(this.selectedTeamscan?.scoreCommitment);
      return {
        "score": this.selectedTeamscan?.scoreCommitment,
        "previousScore": this.previousTeamscan?.scoreCommitment,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[2].id,
          "name": this.dysfunctions[2].name
        },
      };
    },
    getAccountability() {
      let level = this.calculateLevel(this.selectedTeamscan?.scoreAccountability);
      return {
        "score": this.selectedTeamscan?.scoreAccountability,
        "previousScore": this.previousTeamscan?.scoreAccountability,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[3].id,
          "name": this.dysfunctions[3].name
        },
      };
    },
    getResults() {
      let level = this.calculateLevel(this.selectedTeamscan?.scoreResults);
      return {
        "score": this.selectedTeamscan?.scoreResults,
        "previousScore": this.previousTeamscan?.scoreResults,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[4].id,
          "name": this.dysfunctions[4].name
        },
      };
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
        this.trust = this.getTrust;
        this.conflict = this.getConflict;
        this.commitment = this.getCommitment;
        this.accountability = this.getAccountability;
        this.results = this.getResults;
        /*let test =
            [
          {
            "levelid": this.trust.level.id,
            "dysfunctionid": this.trust.dysfunction.id
          },
          {
            "levelid": this.conflict.level.id,
            "dysfunctionid": this.conflict.dysfunction.id
          },
          {
            "levelid": this.commitment.level.id,
            "dysfunctionid": this.commitment.dysfunction.id
          }
          ,
          {
            "levelid": this.accountability.level.id,
            "dysfunctionid": this.accountability.dysfunction.id
          }
          ,
          {
            "levelid": this.results.level.id,
            "dysfunctionid": this.results.dysfunction.id
          }
        ]*/
        /*await this.$axios.get(`interpretationtranslations/${1}`, {params: { test }}).then(res => this.interpretations = res.data).catch(err => console.log(err))*/
      }
      this.overlay = !this.overlay;
    },
    calculateLevel(score) {
      if (score >= this.levels[0]?.lowerLimit && score <= this.levels[0]?.upperLimit)
        return this.levels[0]
      else if (score >= this.levels[1]?.lowerLimit && score <= this.levels[1]?.upperLimit)
        return this.levels[1]
      else if (score >= this.levels[2]?.lowerLimit && score <= this.levels[2]?.upperLimit)
        return this.levels[2]
      else
        return this.levels[3]
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
.dividerStyle {
  background-color: #E9ECEF;
}
</style>
