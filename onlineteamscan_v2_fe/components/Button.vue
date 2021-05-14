<template>
  <v-btn style="font-weight: bold; background-color: #71BF42; text-transform: none; font-size: 14px;" :disabled="disabled" depressed>
    <v-icon
      v-if="icon != null"
      left
      color="white">
      {{ icon }}
    </v-icon>
    <span style="color: white;">{{ text }}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'Button',
  components: {
  },
  props: {
    text: { // REV: recommend that prop type is a constructor
      type: String,
      default: ''
    },
    icon: '',
    disabled: {
      required: false,
      default: false
    }
  },
}
</script>
