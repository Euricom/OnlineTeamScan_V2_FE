<template>
  <div class="mainwrapper">
    <v-row>
      <v-col cols="3"/>
      <v-col cols="6">
        <v-row>
          <svg version="1.1" id="Pyramid" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
               viewBox="0 0 468.6 398.9" style="enable-background:new 0 0 468.6 398.9;" xml:space="preserve">
            <style type="text/css">
              .st0{fill:#E2E5E5;}
            </style>
                    <g id="Pyramid_Left">
              <g id="Trust">
                <polygon ref="trustPrevious" class="st0" points="230.4,398.9 0,398.9 42.3,326.2 230.4,326.2 		"/>
                <path class="st0" d="M239.2,76.8"/>
              </g>
                      <g id="Conflict">
                <polygon ref="conflictPrevious" class="st0" points="230.4,318.7 46,318.7 85.5,250.3 230.4,250.3 		"/>
              </g>
                      <g id="Commitment">
                <polygon ref="commitmentPrevious" class="st0" points="230,242.7 89.8,242.7 127.8,176.9 230.4,176.9 		"/>
              </g>
                      <g id="Accountability">
                <polygon ref="accountabilityPrevious" class="st0" points="230.4,169.2 132.1,169.2 173.1,98.2 230.1,98.2 		"/>
                        <path class="st0" d="M230.4,90.7"/>
              </g>
                      <g id="Results">
                <polygon ref="resultsPrevious" class="st0" points="230.1,90.7 177.6,90.7 230.4,0 		"/>
              </g>
            </g>
                    <g id="Pyramid_Right">
              <g id="Trust_1_">
                <polygon ref="trustCurrent" class="st0" points="238.2,326.2 426.3,326.2 468.6,398.9 238.2,398.9 		"/>
                <path class="st0" d="M229.4,76.8"/>
              </g>
                      <g id="Conflict_1_">
                <polygon ref="conflictCurrent" class="st0" points="238.2,250.3 383.1,250.3 422.6,318.7 238.2,318.7 		"/>
              </g>
                      <g id="Commitment_1_">
                <polygon ref="commitmentCurrent" class="st0" points="238.2,176.9 340.8,176.9 378.8,242.7 238.6,242.7 		"/>
              </g>
                      <g id="Accountability_1_">
                <polygon ref="accountabilityCurrent" class="st0" points="238.5,98.2 295.5,98.2 336.5,169.2 238.2,169.2 		"/>
                        <path class="st0" d="M238.2,90.7"/>
              </g>
                      <g id="Results_1_">
                <polygon ref="resultsCurrent"v-if=""  class="st0" points="238.2,0 291,90.7 238.5,90.7 		"/>
              </g>
            </g>
            </svg>
        </v-row>
        <v-row>
            <v-col>
              <div class="info-previous-teamscan" v-if="previousTeamscan.id !== currentTeamscan.id">
                  <span>{{this.previousTeamscan.title}}</span>
                <span class="sub-toolbar-title">{{this.formatDate(this.previousTeamscan.endDate)}}</span>
              </div>
            </v-col>
            <v-col class="info-current-teamscan">
              <span>{{this.currentTeamscan.title}}</span>
              <span class="sub-toolbar-title">{{this.formatDate(this.currentTeamscan.endDate)}}</span>
            </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <div class="score-legend-wrapper">
          <div class="score-legend">
            <div class="score-legend-section">
              <div class="box high-score"/>
              <span>Hoog (4 & Hoger)</span>
            </div>
            <div class="score-legend-section">
              <div class="box medium-score"/>
              <span>Gemiddeld (3 - 3.99)</span>
            </div>
            <div class="score-legend-section">
              <div class="box low-score"/>
              <span>Laag (Minder dan 3)</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {scoreMixin} from '@/mixins/scoreMixin'
import { globalMixin } from '@/mixins/globalMixin'

export default {
  name: 'ProgressionPyramid',
  mixins: [
    scoreMixin,
    globalMixin
  ],
  props: {
    previousTeamscan: {
      type: Object,
      required: true,
    },
    currentTeamscan: {
      type: Object,
      required: true,
    },
    levels: {
      type: Array,
      required: true,
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.currentTeamscan === null) return null

      let currentTrustLayer = this.$refs.trustCurrent
      let currentConflictLayer = this.$refs.conflictCurrent
      let currentCommitmentLayer = this.$refs.commitmentCurrent
      let currentAccountabilityLayer = this.$refs.accountabilityCurrent
      let currentResultsLayer = this.$refs.resultsCurrent

      currentTrustLayer.style.fill = this.calculateLevelColor(this.currentTeamscan.scoreTrust)
      currentConflictLayer.style.fill = this.calculateLevelColor(this.currentTeamscan.scoreConflict)
      currentCommitmentLayer.style.fill = this.calculateLevelColor(this.currentTeamscan.scoreCommitment)
      currentAccountabilityLayer.style.fill = this.calculateLevelColor(this.currentTeamscan.scoreAccountability)
      currentResultsLayer.style.fill = this.calculateLevelColor(this.currentTeamscan.scoreResults)

      if (this.previousTeamscan.id !== this.currentTeamscan.id) {
        let previousTrustLayer = this.$refs.trustPrevious
        let previousConflictLayer = this.$refs.conflictPrevious
        let previousCommitmentLayer = this.$refs.commitmentPrevious
        let previousAccountabilityLayer = this.$refs.accountabilityPrevious
        let previousResultsLayer = this.$refs.resultsPrevious

        previousTrustLayer.style.fill = this.calculateLevelColor(this.previousTeamscan.scoreTrust)
        previousConflictLayer.style.fill = this.calculateLevelColor(this.previousTeamscan.scoreConflict)
        previousCommitmentLayer.style.fill = this.calculateLevelColor(this.previousTeamscan.scoreCommitment)
        previousAccountabilityLayer.style.fill = this.calculateLevelColor(this.previousTeamscan.scoreAccountability)
        previousResultsLayer.style.fill = this.calculateLevelColor(this.previousTeamscan.scoreResults)
      }
    })
  },
}
</script>

<style scoped>

.mainwrapper{
 /* display: grid;
  grid-template-areas:
    'dysfunction-legend pyramid score-legend'
    'dysfunction-legend pyramid score-legend'
    'dysfunction-legend info-teamscan score-legend';*/
}
.pyramid {
  /*grid-area: pyramid;
  display: flex;
  justify-content: center;*/
}
.dysfunction-legend {
  /*grid-area: dysfunction-legend;
  background-color: green;*/
}
.score-legend-wrapper{
  display: flex;
  justify-content: center;
}
.score-legend {
  display: flex;
  flex-direction: column;
}
.score-legend-section {
  display: flex;
  flex-direction: row;
}
.info-teamscan {
  /*grid-area: info-teamscan;*/
  /*display: grid;*/
  /*grid-template-areas:*/
  /*  'info-previous-teamscan info-current-teamscan';*/
  /*margin-top: 10px;*/
}
.info-previous-teamscan {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info-current-teamscan {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.teamscan-date {

}
.box {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.high-score {
  background-color: #93EB5F;
}
.medium-score {
  background-color: #FFD54A;
}
.low-score{
  background-color: #F95656;
}
</style>
