<template>
  <v-app class="appStyle">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app>
      <v-container class="logoContainer">
        <v-row justify="center" align="center">
          <Logo/>
          <span class="font-weight-medium toolbar-title logoTitle">{{ title }}</span>
        </v-row>
      </v-container>

        <v-list class="sideMenuList">
          <v-subheader class="subheader">Algemeen</v-subheader>
          <v-list-item-group>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :to="item.to"
              router
              exact :ripple="false">
                <v-list-item-icon>
                  <v-icon color="#5D5C61">{{ item.icon }}</v-icon>
                </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="sideNavBarListItem" v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      class="custom-primary topNavBar">
      <v-app-bar-nav-icon color="#FFFFFF" @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-btn icon class="notificationIcon">
        <v-badge overlap color="custom-green" dot :value="false">
          <v-icon color="#FFFFFF">mdi-bell</v-icon>
        </v-badge>
      </v-btn>
      <span v-if="this.$auth.loggedIn" class="text">{{ $auth.user.firstname }} {{ $auth.user.lastname }}</span>
      <v-menu
        transition="slide-y-transition"
        left
        bottom
        offset-y
        :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            @click="menuClicked=!menuClicked">
            <v-icon v-if="!menuClicked" color="#FFFFFF">mdi-menu-down</v-icon>
            <v-icon v-else color="#FFFFFF">mdi-menu-up</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
             <v-icon dense class="menuItemIcon">mdi-web</v-icon>
             <v-list-item-title>Taal</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-icon dense class="menuItemIcon">mdi-logout</v-icon>
            <v-list-item-title>Uitloggen</v-list-item-title>
          </v-list-item>
        </v-list>

      </v-menu>
    </v-app-bar>
    <v-main>
        <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import Logo from "@/components/Logo";

export default {
  middleware: 'auth',
  components: {
    Logo,
  },
  data () {
    return {
      menuClicked: false,
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
          to: '/scanresults'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Teams',
          to: '/teams'
        }
      ],
      userOptions: [
        {
          title: "Language",
          icon: "mdi-web",
        },
        {
          title: "Logout",
          icon: "mdi-logout",
        },
      ],
      title: 'Online Team Scan'
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    logout()
    {
      this.$auth.logout()
    }
  },
}
</script>

<style scoped>
.appStyle {
  background-color: #EDEDEF;
}
.text {
  color: #FFFFFF;
  font-weight: normal;
  font-size: 16px;
}
.subheader {
  color:#A8A8A8;
  font-size: 12px;
}
.logoContainer {
  margin-top: 15px;
  margin-bottom: 15px;
}
.topNavBar {
  box-shadow: none;
}
.logoTitle {
  color: #656565;
  font-size: 20px;
  margin-left: 15px;
}
.notificationIcon {
  margin-right: 5px;
}
.sideNavBarListItem {
  color: #5D5C61;
  font-size: 14px;
}
.menuItemIcon {
  margin-right: 10px;
}
.sideMenuList .v-list-item--active {
  color: #FFFFFF !important;
  border-left-style: solid !important;
  border-width: 4px;
  border-color: #71BF42 !important;
}
.sideMenuList .v-list-item--active .v-list-item__title {
  color: #71BF42 !important;
}
.sideMenuList .v-list-item--active .v-icon {
  color: #71BF42 !important;
}
.sideMenuList .v-list-item:hover {
  color: #FFFFFF !important;
}
.sideMenuList .v-list-item:before {
  color: #FFFFFF !important;
}
.sideMenuList .v-list-item:after {
  color: #FFFFFF !important;
}
</style>
