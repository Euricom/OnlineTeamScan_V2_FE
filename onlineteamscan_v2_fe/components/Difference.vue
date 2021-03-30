<template>
  <div>
    <v-icon :color="icons[0].color" v-if="this.calculateScore < 0">
      {{ icons[0].icon }}
    </v-icon>
    <v-icon :color="icons[2].color" v-else-if="this.calculateScore > 0">
      {{ icons[2].icon }}
    </v-icon>
    <v-icon :color="icons[1].color" small v-else>
      {{ icons[1].icon }}
    </v-icon>
    <span style="color: #5A677A; font-weight: bold; font-size: 12px; margin-right: 25px" v-if="this.calculateScore < 0 || this.calculateScore > 0">
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
          "icon": "mdi-minus",
          "color": "#5A677A",
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
    calculateIcon() {
      if (this.calculateScore < 0)
        return this.icons[0]
      else if(this.calculateScore > 0)
        return this.icons[2]
      else
        return this.icons[1]
    },
  }
}
</script>
