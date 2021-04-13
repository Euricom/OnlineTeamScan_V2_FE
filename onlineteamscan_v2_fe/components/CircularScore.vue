<template>
  <div>
    <h1 class="font-weight-medium card-title">
      {{ item.dysfunction.name }}
    </h1>

  <v-progress-circular
    size="150"
    width="20"
    rotate="-90"
    :value="calculateProgress"
    :color="item.level.color"
    class="circular-score">
    {{ item.score }}
  </v-progress-circular>

  <Difference v-if="item.previousScore !== undefined" :previous-score="item.previousScore" :current-score="item.score"/>
  </div>
</template>

<script>
import Difference from "@/components/Difference";
export default {
  name: 'CircularScore',
  components: {
    Difference,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    calculateProgress() {
      return this.item.score * 20;
    }
  },
}
</script>

<style scoped>
.card-title {
  font-size: 20px;
  color: #343A40;
}
.circular-score {
  font-size: 22px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
}
</style>
