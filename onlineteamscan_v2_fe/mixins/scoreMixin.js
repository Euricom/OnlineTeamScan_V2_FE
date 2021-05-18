export const scoreMixin = {
  methods: {
    calculateLevel(score) {
      if (score >= this.levels[0].lowerLimit && score <= this.levels[0].upperLimit) return this.levels[0]
      if (score >= this.levels[1].lowerLimit && score <= this.levels[1].upperLimit) return this.levels[1]
      if (score >= this.levels[2].lowerLimit && score <= this.levels[2].upperLimit) return this.levels[2]
      return this.levels[3]
    },
    calculateLevelColor(score) {
      const level = this.calculateLevel(score) // REV: Level is never reassigned, could also be one liner to return
      return level.color // REV: ex. return this.calculateLevel(score).color
    },
    getColor(levelId) {
      let result = this.levels.find(obj => {
        return obj.id === levelId
      })
      return result.color
    },
    getInterpretationDysfunctionTitle(prop) {
      return this.dysfunctions[prop - 1].name
    },
  },
};
