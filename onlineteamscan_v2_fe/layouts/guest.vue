<template>
  <v-app class="app-style">
    <v-app-bar
      fixed
      app
      class="custom-primary top-nav-bar">
      <Logo/>
      <span class="font-weight-medium toolbar-title logo-title">{{ title }}</span>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Logo from "@/components/Logo";

export default {
  components: {
    Logo,
  },
  data () {
    return {
      title: 'Online Team Scan'
    }
  },
}
</script>

<style scoped>
.app-style {
  background-color: #EDEDEF;
}
.top-nav-bar {
  box-shadow: none;
}
.logo-title {
  color: #FFFFFF;
  font-size: 20px;
  margin-left: 15px;
}
</style>

