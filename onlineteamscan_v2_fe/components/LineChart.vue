<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'LineChart',
  extends: Line,
  mixins: [Line],
  props: {
    chartTitles:  {
      type: Array,
      required: true,
      default: null
    },
    chartData:  {
      type: Array,
      required: true,
      default: null
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
