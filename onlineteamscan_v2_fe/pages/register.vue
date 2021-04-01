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
      <v-row v-if="errorMessage != ''">
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
      <v-form
        v-model="isFormValid">
      <v-row>
        <v-col class="mx-8">
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            required
            filled
            label="Voornaam"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mx-8">
          <v-text-field
            v-model="lastname"
            :rules="nameRules"
            required
            filled
            label="Naam"
          ></v-text-field>
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
            counter
            @click:append="showPassowrd = !showPassowrd"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mx-8">
          <v-text-field
            v-model="confirmPassword"
            filled
            label="Bevestig Wachtwoord"
            :rules="confirmPasswordRules"
            required
            :append-icon="showPassowrd ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassowrd ? 'text' : 'password'"
            counter
            @click:append="showPassowrd = !showPassowrd"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mx-8 my-auto py-0 pl-0 ml-0" align="right">
          <Button @click.native="register" :disabled="!isFormValid" :text="'Registreren'"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center" class="mx-8 py-0 mb-8">
          <NuxtLink to="/login">Al geen account?</NuxtLink>
        </v-col>
      </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: "register.vue",
  layout: 'auth',
  data(){
    return{
      EuricomLogo: './EuricomLogo.svg',
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      confirmPassword: '',
      checkbox: false,
      showPassowrd: false,
      isFormValid: false,
      errorMessage: '',
      passwordRules: [
        value => !!value || 'Vereist',
        v => v.length >= 8 || 'Min 8 characters',
        v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 'Moet minstens 1 hoofdletter, nummer en speciaal teken bevatten'
      ],
      confirmPasswordRules: [
        value => !!value || 'Vereist',
        v => v === this.password || 'Het wachtwoord komt niet overeen'
      ],
      emailRules: [
        value => !!value || 'Vereist',
        v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Moet een geldig email adress zijn',
      ],
      nameRules: [
        value => !!value || 'Vereist',
        v => /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(v) || 'Moet geldig zijn',
        v => v.length <= 70 || 'Max 70 characters'
      ]
    }
  },
  methods: {
    async register() {
      const user = {
        "Email": this.email,
        "Firstname": this.firstname,
        "Lastname": this.lastname,
        "Password": this.password
      }
      this.$axios.post('authenticate/register', user).then((response) => {
        if(response.status === 200){
          this.$router.push("/login")
        }
      }).catch((e) => this.errorMessage = e.response.data.message)
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
  background-color: rgba(255, 255, 255, 0.75);
}
</style>
