import {
  getModel,
  getPercentage,
  notDivides,
  mixin
} from './slider-utils'
import { QChip } from '../chip'

export default {
  name: 'q-slider',
  mixins: [mixin],
  props: {
    value: {
      type: Number,
      required: true
    },
    labelValue: String
  },
  data () {
    return {
      model: this.value,
      dragging: false,
      currentPercentage: (this.value - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage () {
      if (this.snap) {
        return (this.model - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    },
    displayValue () {
      return this.labelValue !== void 0
        ? this.labelValue
        : this.model
    }
  },
  watch: {
    value (value) {
      if (this.dragging) {
        return
      }
      if (value < this.min) {
        this.model = this.min
      }
      else if (value > this.max) {
        this.model = this.max
      }
      else {
        this.model = value
      }
      this.currentPercentage = (this.model - this.min) / (this.max - this.min)
    },
    min (value) {
      if (this.model < value) {
        this.model = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    max (value) {
      if (this.model > value) {
        this.model = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    step () {
      this.$nextTick(this.__validateProps)
    }
  },
  methods: {
    __setActive (event) {
      let container = this.$refs.handle

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      }
      this.__update(event)
    },
    __update (event) {
      let
        percentage = getPercentage(event, this.dragging),
        model = getModel(percentage, this.min, this.max, this.step, this.decimals)

      this.currentPercentage = percentage
      if (model !== this.model) {
        this.$emit('input', model)
        this.model = model
      }
    },
    __end () {
      this.dragging = false
      this.currentPercentage = (this.model - this.min) / (this.max - this.min)
      this.$emit('change', this.model)
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step, this.decimals)
      }
    },
    __getContent (h) {
      return [
        h('div', {
          staticClass: 'q-slider-track active-track',
          style: { width: this.percentage },
          'class': {
            'no-transition': this.dragging,
            'handle-at-minimum': this.model === this.min
          }
        }),
        h('div', {
          staticClass: 'q-slider-handle',
          style: {
            left: this.percentage,
            borderRadius: this.square ? '0' : '50%'
          },
          'class': {
            dragging: this.dragging,
            'handle-at-minimum': !this.fillHandleAlways && this.model === this.min
          }
        }, [
          this.label || this.labelAlways
            ? h(QChip, {
              staticClass: 'q-slider-label no-pointer-events',
              'class': { 'label-always': this.labelAlways },
              props: {
                pointing: 'down',
                square: true,
                color: this.labelColor
              }
            }, [ this.displayValue ])
            : null,
          __THEME__ !== 'ios'
            ? h('div', { staticClass: 'q-slider-ring' })
            : null
        ])
      ]
    }
  }
}
