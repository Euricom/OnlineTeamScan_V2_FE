<template>
  <div>
    <v-icon :color="icons[0].color" v-if="this.calculateScore < 0">
      {{ icons[0].icon }}
    </v-icon>
    <v-icon :color="icons[1].color" v-else-if="this.calculateScore > 0">
      {{ icons[1].icon }}
    </v-icon>
    <span class="difference-text" v-if="this.calculateScore < 0 || this.calculateScore > 0">
      {{ Math.abs(calculateScore) }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Difference',
  components: {
  },
  props: {
    currentScore: {
      type: Number,
      required: true,
    },
    previousScore: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      difference: 0,
      icons: [
        {
          "icon": "mdi-menu-down",
          "color": "#F95656",
        },
        {
          "icon": "mdi-menu-up",
          "color": "#93EB5F",
        },
      ]
    }
  },
  computed: {
    calculateScore() {
      return (this.currentScore - this.previousScore).toFixed(1);
    },
  }
}
</script>

<style scoped>
.difference-text {
  color: #5A677A;
  font-weight: bold;
  font-size: 12px;
  margin-right: 25px
}
</style>
