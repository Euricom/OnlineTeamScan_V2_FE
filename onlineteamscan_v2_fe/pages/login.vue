<template>
    <v-container>
      <v-card class=" mx-auto my-12 form">
        <v-row class="pt-8">
          <v-col align="center">
            <img class="py-0 euricom-logo" :src="EuricomLogo">
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
              dense
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
          <v-col class="mx-8 my-auto py-0 pl-0 ml-0" align="right">
            <Button id="custom-disabled" @click.native="Login" :disabled="!isFormValid" :text="'Inloggen'"/>
          </v-col>
        </v-row>
        </v-form>
        <v-row>
          <v-col align="center" class="mx-8 py-5">
            <NuxtLink to="/register">Nog geen account?</NuxtLink>
          </v-col>
        </v-row>
      </v-card>
      <v-btn fab right bottom fixed color="custom-green" class="custom-static-btn" @click="navigateHelp">
        <v-icon color="white">mdi-help</v-icon>
      </v-btn>
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

      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
      }
      catch (error) {
        this.errorMessage = error.response.data.message
      }
    },
    navigateHelp(){
      this.$router.push({path: 'help'})
    }
  }
}
</script>

<style scoped>
  .form {
    max-width: 500px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 20px;
  }
  .euricom-logo {
    width: 100px;
  }
  #custom-disabled.v-btn--disabled {
    background-color: rgba(205, 205, 205, 1) !important;
  }
</style>

<style scoped>
input:-webkit-autofill{
  -webkit-background-clip: text;
}
input:-webkit-autofill:hover{
  -webkit-background-clip: text;
}
input:-webkit-autofill:focus textarea:-webkit-autofill{
  -webkit-background-clip: text;
}
textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus{
  -webkit-background-clip: text;
}
select:-webkit-autofill{
  -webkit-background-clip: text;
}
select:-webkit-autofill:hover{
  -webkit-background-clip: text;
}
select:-webkit-autofill:focus {
  -webkit-background-clip: text;
}
</style>
