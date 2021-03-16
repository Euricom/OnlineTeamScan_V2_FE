<template>
    <v-container>
      <v-card class=" mx-auto my-12 form" style="border-radius: 20px">
        <v-row class="pt-8">
          <v-col align="center">
            <img class="py-0" :src="EuricomLogo" width="100px">
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-title class="justify-center py-0" style="font-size: 32px">Online Team Scan</v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-8">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              required
              filled
              label="E-mail"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-8">
            <v-text-field
              v-model="password"
              filled
              label="Wachtwoord"
              :rules="passwordRules"
              required
              :append-icon="showPassowrd ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassowrd ? 'text' : 'password'"
              hint="At least 8 characters"
              counter
              @click:append="showPassowrd = !showPassowrd"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-8 py-0 pr-0 mr-0">
            <v-checkbox
              v-model="checkbox"
              label="Onthoud mij?"
            ></v-checkbox>
          </v-col>
          <v-col class="mx-8 my-auto py-0 pl-0 ml-0" align="right">
            <Button :text="'Inloggen'"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center" class="mx-8 py-0">
            <NuxtLink to="/register">Nog geen account?</NuxtLink>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center" class="mx-8 mb-8 py-0">
            <NuxtLink to="/forgot-password">Wachtwoord vergeten?</NuxtLink>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
</template>

<script>
export default {
  name: "login.vue",
  layout: 'auth',
  data(){
    return{
      EuricomLogo: './EuricomLogo.svg',
      email: '',
      password: '',
      checkbox: false,
      showPassowrd: false,
      passwordRules: [
        value => !!value || 'Required.',
        v => v.length >= 8 || 'Min 8 characters'
      ],
      emailRules: [
        value => !!value || 'Required.',
        v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
      ]
    }
  },
}
</script>

<style scoped>
  .form {
    max-width: 500px;
    background-color: rgba(255, 255, 255, 0.75);
  }

  html, body {
    overflow: hidden;
    height: 100vh;
  }
</style>
