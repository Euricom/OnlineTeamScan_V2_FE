<template>
  <v-container>
    <Guide/>
  </v-container>
</template>

<script>
import Guide from "../components/Guide.vue";
export default {
  name: "help.vue",
  layout: "guest",
  comments: [
    Guide
  ],
}
</script>

<style scoped>

</style>
