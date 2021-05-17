<template>
  <div class="main-wrapper">
<!--    <div class="row-results">
      <PyramidScore/>
      <PyramidScore/>
    </div>
    <div class="row-accountability">
      <PyramidScore/>
      <PyramidScore/>
    </div>
    <div class="row-commitment">
      <PyramidScore/>
      <PyramidScore/>
    </div>
    <div class="row-conflict">
      <PyramidScore/>
      <PyramidScore/>
    </div>
    <div class="row-trust">
      <PyramidScore/>
      <PyramidScore/>
    </div>-->
    <PyramidScore class="previous-results"/>
    <PyramidScore class="current-results"/>
    <PyramidScore class="previous-accountability"/>
    <PyramidScore class="current-accountability"/>
    <PyramidScore class="previous-commitment"/>
    <PyramidScore class="current-commitment"/>
    <PyramidScore class="previous-conflict"/>
    <PyramidScore class="current-conflict"/>
    <PyramidScore class="previous-trust"/>
    <PyramidScore class="current-trust"/>
  </div>
</template>

<script>
import PyramidScore from "./PyramidScore";

export default {
  name: "TestPyramid.vue",
  components: {
    PyramidScore,
  },
  props: {
    pyramidData: {
      type: Object,
      required: true,
    },
    levels: {
      type: Array,
      required: true,
    }
  },
}
</script>

<style scoped>
.main-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  grid-gap: 5px;
  width: 500px;
  height: 500px;
  position: relative;
  z-index: 1;
  overflow: hidden;
}
.main-wrapper:before {
  content: '';
  background-color: white;
  width: 800px;
  height: 500px;
  position: absolute;
  top: -25%;
  left: 38%;
  transform: rotate(64deg);
  z-index: 2;
}
.main-wrapper:after {
  background-color: white;
  content: '';
  width: 800px;
  height: 500px;
  position: absolute;
  top: -25%;
  right: 38%;
  transform: rotate(-64deg);
  z-index: 2;
}
.previous-results {
  grid-row: 1;
  grid-column: 1;
}
.previous-accountability {
  grid-row: 2;
  grid-column: 1;
}
.previous-commitment {
  grid-row: 3;
  grid-column: 1;
}
.previous-conflict {
  grid-row: 4;
  grid-column: 1;
}
.previous-trust {
  grid-row: 5;
  grid-column: 1;
}

.current-results {
  grid-row: 1;
  grid-column: 2;
}
.current-accountability {
  grid-row: 2;
  grid-column: 2;
}
.current-commitment {
  grid-row: 3;
  grid-column: 2;
}
.current-conflict {
  grid-row: 4;
  grid-column: 2;
}
.current-trust {
  grid-row: 5;
  grid-column: 2;
}

</style>
