<template>
  <v-card fluid v-if="isSmallScreen" align="center">
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="4">
          <CircularScore :item="getTrust"/>
        </v-col>
        <v-col cols="12" sm="4">
          <CircularScore :item="getConflict"/>
        </v-col>
        <v-col cols="12" sm="4">
          <CircularScore :item="getCommitment"/>
        </v-col>
        <v-col cols="12" sm="4">
          <CircularScore :item="getAccountability"/>
        </v-col>
        <v-col cols="12" sm="4">
          <CircularScore :item="getResults"/>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <v-card align="center" v-else>
    <v-container fluid>
      <v-layout>
        <v-flex><CircularScore :item="getTrust"/></v-flex>
        <v-divider vertical class="divider" v-if="showDividers"/>
        <v-flex><CircularScore :item="getConflict"/></v-flex>
        <v-divider vertical class="divider" v-if="showDividers"/>
        <v-flex><CircularScore :item="getCommitment"/></v-flex>
        <v-divider vertical class="divider" v-if="showDividers"/>
        <v-flex><CircularScore :item="getAccountability"/></v-flex>
        <v-divider vertical class="divider" v-if="showDividers"/>
        <v-flex><CircularScore :item="getResults"/></v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import CircularScore from "@/components/CircularScore";
import { globalMixin } from '@/mixins/globalMixin'
import { scoreMixin } from '@/mixins/scoreMixin'
export default {
  name: 'ScoreCard',
  mixins: [globalMixin, scoreMixin],
  components: {
    CircularScore
  },
  props: {
    dysfunctions: {
      type: Array,
      required: true,
    },
    levels: {
      type: Array,
      required: true,
    },
    scores: {
      type: Object,
      required: true,
    },
    previousTeamscan: {
      type: Object,
      required: false,
    },
    showDividers: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    getTrust() {
      const level = this.calculateLevel(this.scores.scoreTrust);
      return {
        "score": this.scores.scoreTrust,
        "previousScore": this.previousTeamscan?.scoreTrust,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[0].dysfunction.id,
          "name": this.dysfunctions[0].name
        },
      };
    },
    getConflict() {
      const level = this.calculateLevel(this.scores.scoreConflict);
      return {
        "score": this.scores.scoreConflict,
        "previousScore": this.previousTeamscan?.scoreConflict,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[1].dysfunction.id,
          "name": this.dysfunctions[1].name
        },
      };
    },
    getCommitment() {
      const level = this.calculateLevel(this.scores.scoreCommitment);
      return {
        "score": this.scores.scoreCommitment,
        "previousScore": this.previousTeamscan?.scoreCommitment,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[2].dysfunction.id,
          "name": this.dysfunctions[2].name
        },
      };
    },
    getAccountability() {
      const level = this.calculateLevel(this.scores.scoreAccountability);
      return {
        "score": this.scores.scoreAccountability,
        "previousScore": this.previousTeamscan?.scoreAccountability,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[3].dysfunction.id,
          "name": this.dysfunctions[3].name
        },
      };
    },
    getResults() {
      const level = this.calculateLevel(this.scores.scoreResults);
      return {
        "score": this.scores.scoreResults,
        "previousScore": this.previousTeamscan?.scoreResults,
        "level": level,
        "dysfunction": {
          "id": this.dysfunctions[4].dysfunction.id,
          "name": this.dysfunctions[4].name
        },
      };
    },
  },
}
</script>

<style scoped>
.divider {
  background-color: #E9ECEF;
}
</style>
