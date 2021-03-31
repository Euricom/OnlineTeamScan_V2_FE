<template>
  <div>
    <v-toolbar elevation="0">
      <v-toolbar-title
        class="font-weight-medium"
        style="color: #343A40; font-size: 24px;">
        Teams
      </v-toolbar-title>
      <v-spacer/>
      <Button :text="'Nieuw Team'" :icon="'mdi-account-multiple-plus'" style="margin-left: 20px;"/>
    </v-toolbar>

    <v-container>
          <custom-list-item v-for="(team, index) in teams" :key="index" :team="team"/>
    </v-container>

  </div>
</template>

<script>
import CustomListItem from "../components/CustomListItem";

export default {
  components: {
    CustomListItem,
  },
  data() {
    return {
      teams: []
    }
  },
  created() {
    this.$axios.get(`http://localhost:49783/api/teams/teammembers/${this.$auth.user.id}`)
      .then(response => this.teams = response.data)
      .catch(err => console.log(err))
  }
}
</script>
