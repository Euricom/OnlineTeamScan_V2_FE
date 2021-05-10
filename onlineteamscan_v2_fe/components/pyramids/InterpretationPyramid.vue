<template>
<div>
  <svg version="1.1" id="Pyramid" :class="isSmallPyramid ? 'small-pyramid' : 'default-pyramid'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       width="120px" height="90px" viewBox="0 0 460.8 398.9" style="enable-background:new 0 0 460.8 398.9;" xml:space="preserve">
      <style type="text/css">
        .st0{fill:#E2E5E5;}
        .st1{fill:#E2E5E5;stroke:#E2E5E5;stroke-miterlimit:10;}
      </style>

      <g id="Trust">
        <polygon ref="trust" class="st0" points="460.8,398.9 0,398.9 42.3,326.2 419,326.2 	"/>
      </g>

      <g id="Conflict">
        <polygon ref="conflict" class="st1" points="414.8,318.7 46,318.7 85.5,250.3 375.3,250.3 	"/>
      </g>

      <g id="Commitment">
        <polygon ref="commitment" class="st1" points="370.3,242.7 89.8,242.7 127.8,176.9 332.7,176.9 	"/>
      </g>

      <g id="Accountability">
        <polygon ref="accountability" class="st0" points="328.1,169.2 132.1,169.2 173.1,98.2 287.3,98.2 	"/>
        <path class="st0" d="M230.4,90.7"/>
      </g>

      <g id="Results">
        <polygon ref="results" class="st0 results-layer" points="282.5,90.7 177.6,90.7 230.4,0 	"/>
      </g>
  </svg>
</div>
</template>

<script>
export default {
  name: 'InterpretationPyramid',
  props: {
    isSmallPyramid: {
      type: Boolean,
      required: true,
    },
    dysfunctionId: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    }
  },
  created() {
    if (this.dysfunctionId < 1 || this.dysfunctionId > 5)
      return null;

    this.$nextTick(() => {
      let layer
      switch (this.dysfunctionId) {
        case 1:
          layer = this.$refs.trust
              break;
        case 2:
          layer = this.$refs.conflict
             break;
        case 3:
          layer = this.$refs.commitment
              break;
        case 4:
          layer = this.$refs.accountability
              break;
        case 5:
          layer = this.$refs.results
              break;
      }
      layer.style.fill = this.color
    })
  },
}
</script>

<style scoped>
.default-pyramid {
  width: 9.375em;
  height: 7.5em;
}
.small-pyramid {
  width: 7.5em;
  height: 5.625em;
}
</style>
