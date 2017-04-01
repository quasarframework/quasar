import { viewport } from '../../../../utils/dom'

export default {
  data () {
    return {
      responsive: false
    }
  },
  methods: {
    handleResponsive () {
      if (typeof this.config.responsive !== 'undefined') {
        if (!this.config.responsive) {
          this.responsive = false
          return
        }
      }
      this.responsive = viewport().width <= 600
    }
  },
  watch: {
    'config.responsive' () {
      this.$nextTick(this.handleResponsive)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleResponsive()
      window.addEventListener('resize', this.handleResponsive)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResponsive)
  }
}
