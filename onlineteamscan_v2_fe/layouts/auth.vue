<template>
  <v-app class="background">
  <v-main class="full">
    <v-container fill-height>
      <nuxt />
    </v-container>
  </v-main>
  </v-app>
</template>

<script>
export default {
  name: "login.vue",
  setup () {
    const theme = ref('light')

    return {
      theme
    }
  },
}
</script>

<style scoped>
  .background {
    background-image: url("./static/LoginBackgroundFilter.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: center;
    overflow: hidden;
  }
</style>
