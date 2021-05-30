<template>
  <div class="card">
    <div class="heading">
      <h1 class="font-weight-medium header">{{ this.teamscan.team.name }} - {{ this.teamscan.title }}</h1>
      <span class="font-weight-medium sub-header">
        Startdatum: {{ formatDate(this.teamscan.startDate) }} - Einddatum: {{ formatDate(this.teamscan.endDate) }}
      </span>
      <span class="font-weight-medium sub-header">
        Gestart door: {{ this.teamscan.startedBy.firstname + ' ' + this.teamscan.startedBy.lastname }}
      </span>
    </div>

    <div class="circles">
      <CircularScorePDF :scores="returnScoreTrusts"
                        :color="this.calculateLevelColor(this.teamscan.scoreTrust)"
                        :title="this.dysfunctions[0].name"/>
      <CircularScorePDF :scores="returnScoreConflicts"
                        :color="this.calculateLevelColor(this.teamscan.scoreConflict)"
                        :title="this.dysfunctions[1].name"/>
      <CircularScorePDF :scores="returnScoreCommitments"
                        :color="this.calculateLevelColor(this.teamscan.scoreCommitment)"
                        :title="this.dysfunctions[2].name"/>
      <CircularScorePDF :scores="returnScoreAccountabilities"
                        :color="this.calculateLevelColor(this.teamscan.scoreAccountability)"
                        :title="this.dysfunctions[3].name"/>
      <CircularScorePDF :scores="returnScoreResults"
                        :color="this.calculateLevelColor(this.teamscan.scoreResults)"
                        :title="this.dysfunctions[4].name"/>
    </div>

    <div v-if="interpretations.length" class="interpretation-wrapper interpretation-space" v-for="(interpretation, index) in interpretations" :key="index">
      <InterpretationPyramid class="interpretation-pyramid interpretation-pyramid-position" :dysfunction-id="interpretation.interpretation.dysfunctionId" :color="getColor(interpretation.interpretation.levelId)" :is-small-pyramid="true"/>
      <div class="interpretation-dysfunction-wrapper">
        <h1 class="interpretation-dysfunction-title">
          {{ getInterpretationDysfunctionTitle(interpretation.interpretation.dysfunctionId) }}
        </h1>
        <span v-text="interpretation.text" class="interpretation-dysfunction-text"/>
      </div>
    </div>
  </div>
</template>

<script>
import InterpretationPyramid from "@/components/pyramids/InterpretationPyramid";
import {globalMixin} from "@/mixins/globalMixin";
import { scoreMixin } from '@/mixins/scoreMixin'
import CircularScorePDF from "@/components/pdf/CircularScorePDF";
export default {
  name: 'ScanresultPDF',
  components: {
    CircularScorePDF, InterpretationPyramid,
  },
  mixins: [globalMixin, scoreMixin],
  props: {
    teamscan: {
      type: Object,
      required: true,
    },
    previousTeamscan: {
      type: Object,
      required: false,
    },
    dysfunctions: {
      type: Array,
      required: true,
    },
    levels: {
      type: Array,
      required: true,
    },
    interpretations: {
      type: Array,
      required: false,
    }
  },
  computed: {
    returnScoreTrusts() {
      return {
        'currentScore': this.teamscan.scoreTrust,
        'previousScore': this.previousScore?.scoreTrust,
      }
    },
    returnScoreConflicts() {
      return {
        'currentScore': this.teamscan.scoreConflict,
        'previousScore': this.previousScore?.scoreConflict,
      }
    },
    returnScoreCommitments() {
      return {
        'currentScore': this.teamscan.scoreCommitment,
        'previousScore': this.previousScore?.scoreCommitment,
      }
    },
    returnScoreAccountabilities() {
      return {
        'currentScore': this.teamscan.scoreAccountability,
        'previousScore': this.previousScore?.scoreAccountability,
      }
    },
    returnScoreResults() {
      return {
        'currentScore': this.teamscan.scoreResults,
        'previousScore': this.previousScore?.scoreResults,
      }
    },
  },
}
</script>

<style scoped>
* {
  font-family: Roboto, sans-serif;
}
.card {
  padding: 20px;
}
.heading {
  display: flex;
  flex-direction: column;
  margin: 20px 20px 45px;
}
.header {
  color: #343A40;
  font-size: 24px;
  margin-bottom: 5px;
}
.sub-header {
  color: #A8A8A8;
  font-size: 16px;
  margin-bottom: 5px;
}
.interpretation-space {
  margin-bottom: 35px;
  margin-left: 20px;
  margin-right: 20px;
}
.interpretation-pyramid-position {
  margin-right: 10px;
}
.circles {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 55px;
  margin-right: 25px;
}
</style>
