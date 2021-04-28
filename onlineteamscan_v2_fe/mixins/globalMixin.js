export const globalMixin = {
  computed: {
    isSmallScreen() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
    },
  },
  methods: {
    formatDate(prop) {
      let date = new Date(prop)
      let day = date.getDate().toString().padStart(2, '0')
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let year = date.getFullYear().toString()
      return `${day}/${month}/${year}`
    },
  },
};
