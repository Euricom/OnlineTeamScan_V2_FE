<template>
  <div class="wrapper">
    <h1 class="font-weight-medium title">{{ title }}</h1>

    <div class="circle">
      <svg class="circle-svg">
        <circle r="45" cy="70" cx="70" class="track"></circle>
        <circle r="45" cy="60" cx="60" :style="{ stroke: color }" class="progress" ref="progress"></circle>
      </svg>
      <div class="circle-text" :style="{ color: color }">{{ scores.currentScore }}</div>
      <Difference class="difference-position"
        v-if="scores.previousScore !== undefined && scores.previousScore !== scores.currentScore"
        :previous-score="scores.previousScore"
        :current-score="scores.currentScore"/>
    </div>
  </div>
</template>

<script>
import Difference from "@/components/Difference";
export default {
  name: 'CircularScorePDF',
  components: { Difference, },
  props: {
    scores: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    }
  },
  created() {
    this.$nextTick(() => {
      let circle = this.$refs.progress
      let radius = circle.r.baseVal.value
      let circumference = radius * 2 * Math.PI
      circle.style.strokeDasharray = circumference

      const score = this.scores.currentScore * 20
      circle.style.strokeDashoffset = circumference - (score / 100) * circumference
    })
  },
}
</script>

<style scoped>
.track {
  stroke: #D8D8D8;
  stroke-width: 10;
  fill: none;
}
.progress {
  stroke: #D8D8D8;
  stroke-width: 10;
  fill: none;
  transform-origin: center;
  transform: rotate(-90deg);
}
.circle-svg {
  height: 120px;
  width: 140px;
}
.circle-text {
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 20px;
  font-weight: bold;
  color: #D8D8D8;
}
.title {
  font-size: 16px;
  color: #343A40;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
.circle {
  height: 140px;
  width: 140px;
  position: relative;
}
.difference-position {
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  display: flex;
}
</style>
