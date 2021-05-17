<template>
  <div class="score-rectangle">

  </div>
</template>

<script>
import {scoreMixin} from '@/mixins/scoreMixin'

export default {
name: "PyramidScore.vue",
  mixins: [scoreMixin],
  props: {
    score: {
      type: Number,
      required: false,
    },
  }
}
</script>

<style scoped>
.score-rectangle {
  background-color: #93EB5F;
  width: 100%;
  height: 100%;
  /*flex: 0 1 50%;*/
  transition: 0.2s ease-in-out all;
}
.score-rectangle:hover {
  transform: scale(0.95);
}
</style>
