export const scoreMixin = {
  methods: {
    calculateLevel(score) {
      if (score >= this.levels[0].lowerLimit && score <= this.levels[0].upperLimit) return this.levels[0]
      if (score >= this.levels[1].lowerLimit && score <= this.levels[1].upperLimit) return this.levels[1]
      if (score >= this.levels[2].lowerLimit && score <= this.levels[2].upperLimit) return this.levels[2]
      return this.levels[3]
    },
  },
};
