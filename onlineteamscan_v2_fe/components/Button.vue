<template>
  <v-btn style="background-color: #71BF42; text-transform: none; font-size: 16px;" depressed>
    <v-icon
      left
      color="white">
      {{ icon }}
    </v-icon>
    <span style="color: white">{{ text }}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'Button',
  components: {
  },
  props: {
    text: '',
    icon: ''
  },
  data() {
    return {

    }
  }
}
</script>
