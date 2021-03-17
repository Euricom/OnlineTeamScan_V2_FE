<template>
  <div>

    <h1 style="font-size: 20px; color: #343A40;" class="font-weight-medium">
      {{ item.dysfunction.name }}
    </h1>

  <v-progress-circular
    size="150"
    width="20"
    rotate="-90"
    :value="calculateProgress"
    :color="item.level.color"
    style="font-size: 22px; font-weight: bold; margin-top: 15px; margin-bottom: 5px;">
    {{ item.score }}
  </v-progress-circular>

  <Difference :previous-score="item.previousScore" :current-score="item.score"/>

  </div>
</template>

<script>
export default {
  name: 'CircularScore',
  components: {
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
  }
}
</script>
