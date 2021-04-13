<template>
  <v-card align="center">
    <v-container fluid>
      <v-layout>
        <v-flex><CircularScore :item="getTrust"/></v-flex>
        <v-divider vertical class="divider"/>
        <v-flex><CircularScore :item="getConflict"/></v-flex>
        <v-divider vertical class="divider"/>
        <v-flex><CircularScore :item="getCommitment"/></v-flex>
        <v-divider vertical class="divider"/>
        <v-flex><CircularScore :item="getAccountability"/></v-flex>
        <v-divider vertical class="divider"/>
        <v-flex><CircularScore :item="getResults"/></v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import CircularScore from "@/components/CircularScore";
export default {
  name: 'ScoreCard',
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
  methods: {
    calculateLevel(score) {
      if (score >= this.levels[0].lowerLimit && score <= this.levels[0].upperLimit) return this.levels[0]
      if (score >= this.levels[1].lowerLimit && score <= this.levels[1].upperLimit) return this.levels[1]
      if (score >= this.levels[2].lowerLimit && score <= this.levels[2].upperLimit) return this.levels[2]
      return this.levels[3]
    },
  },
}
</script>

<style scoped>
.divider {
  background-color: #E9ECEF;
}
</style>
