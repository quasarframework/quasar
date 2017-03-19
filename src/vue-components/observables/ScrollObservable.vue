<script>
import { getScrollPosition } from '../../utils/scroll'

export default {
  render () {},
  methods: {
    __trigger (e) {
      this.$emit('scroll', getScrollPosition(this.target))
    }
  },
  mounted () {
    this.target = window
    this.target.addEventListener('scroll', this.__trigger)
  },
  beforeDestroy () {
    this.target.removeEventListener('scroll', this.__trigger)
  }
}
</script>
