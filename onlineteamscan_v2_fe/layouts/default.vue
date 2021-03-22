<template>
  <v-app class="appStyle">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      style="box-shadow: none"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <div v-if="this.$auth.loggedIn">{{ $auth.user.firstname }} {{ $auth.user.lastname }}</div>
      <v-menu
        transition="slide-y-transition"
        left
        bottom
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          ><v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(option, index) in userOptions"
            :key="index"
            @click="Test(option.title)"
          >
            <v-list-item-title>{{ option.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container class="ma-0 pa-0">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  middleware: 'auth',
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Dashboard',
          to: '/dashboard'
        },
        {
          icon: 'mdi-poll-box',
          title: 'Scanresultaten',
          to: '/scanresultaten'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Teams',
          to: '/teams'
        }
      ],
      userOptions: [
        {
          title: "Logout"
        }
      ],
      title: 'Vuetify.js'
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    Test(option){
      switch (option) {
        case "Logout":
          this.$auth.logout()
          console.log(this.$auth.loggedIn)
          break;
      }
    }
  },
}
</script>

<style scoped>
.appStyle {
  background-color: #EDEDEF;
}
</style>
