<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [Line],
  props: {
    chartTitles:  {
      type: Array,
      required: true,
    },
    chartData:  {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {

    this.renderChart({
      labels: this.chartTitles,
      datasets: this.chartData
    },
    this.options)
  }
}
</script>
