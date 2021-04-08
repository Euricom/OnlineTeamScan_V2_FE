<template>
  <div>
    <v-card class="question-card" elevation="1">
      <v-card-title class="question-card-title">Vraag {{ question.question.number }}</v-card-title>
      <v-card-text class="question-card-text">
        {{ question.text }}
      </v-card-text>
      <v-card-actions class="question-card-actions">
        <v-radio-group row mandatory v-model="score">
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
  props: {
    question: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      score: null,
    }
  },
  methods: {
      returnAnswer() {
        return {"DysfunctionId": this.question.question.dysfunctionId, "Score": this.score}
      },
    }
}
</script>

<style scoped>
.question-card-title {
  font-weight: bold;
  font-size: 18px;
  color: #343A40;
}
.question-card-text {
  font-size: 16px;
  color: #212121;
  padding-bottom: 0;
}
.question-card {
 margin: 5px 15px 15px;
}
.question-card-actions {
  padding-bottom: 0;
  padding-top: 0;
}
</style>
