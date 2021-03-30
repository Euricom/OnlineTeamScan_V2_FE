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
        <v-form v-model="isFormValid">
        <v-row v-if="errorMessage !== ''">
          <v-col>
            <v-alert
              text
              prominent
              type="error"
            >
              {{ errorMessage }}
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-8">
            <v-text-field
              background-color="rgba(255, 255, 255, 1)"
              v-model="email"
              label="E-mail"
              :rules="emailRules"
              required
              filled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-8">
            <v-text-field
              background-color="rgba(255, 255, 255, 1)"
              v-model="password"
              label="Wachtwoord"
              :rules="passwordRules"
              required
              filled
              :append-icon="showPassowrd ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassowrd ? 'text' : 'password'"
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
            <Button id="custom-disabled" @click.native="Login" :disabled="!isFormValid" :text="'Inloggen'"/>
          </v-col>
        </v-row>
        </v-form>
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
import Button from "../components/Button";

export default {
  name: "login.vue",
  layout: 'auth',
  components: {
    Button,
  },
  data(){
    return{
      EuricomLogo: './EuricomLogo.svg',
      email: '',
      password: '',
      checkbox: false,
      showPassowrd: false,
      errorMessage: '',
      isFormValid: false,
      passwordRules: [
        value => !!value || 'Vereist',
      ],
      emailRules: [
        value => !!value || 'Vereist',
        v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Moet een geldig email adress zijn',
      ]
    }
  },
  methods: {
    async Login(){
      const user = {
        "Email": this.email,
        "Password": this.password
      }
          await this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password
            }
          })
    }
  }
}
</script>

<style scoped>
  html, body {
    overflow: hidden;
    height: 100vh;
  }
  .form {
    max-width: 500px;
    background: rgba(255, 255, 255, 0.85);
  }
  #custom-disabled.v-btn--disabled {
    background-color: rgba(205, 205, 205, 1) !important;
  }
</style>
