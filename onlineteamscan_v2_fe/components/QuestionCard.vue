<template>
  <div>
    <v-card style="margin: 5px 15px 15px;" elevation="1">
      <v-card-title style="font-weight: bold; font-size: 18px; color: #343A40;">Vraag {{ question.question.number }}</v-card-title>
      <v-card-text style="font-size: 16px; color: #212121; padding-bottom: 0">
        {{ question.text }}
      </v-card-text>
      <v-card-actions style="padding-bottom: 0; padding-top: 0">
        <v-radio-group row mandatory v-model="answer">
          <v-radio label="1" value="1"/>
          <v-radio label="2" value="2"/>
          <v-radio label="3" value="3"/>
          <v-radio label="4" value="4"/>
          <v-radio label="5" value="5"/>
        </v-radio-group>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'QuestionCard',
  components: {
  },
  props: {
    question: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      answer: null,
    }
  },
  methods: {
      returnAnswer() {
        return {"DysfunctionId": this.question.question.dysfunctionId, "Score": this.answer}
      },
    }
}
</script>
