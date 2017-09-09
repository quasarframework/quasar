import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'

export default {
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  props: {
    disable: Boolean,
    label: String,
    noCaps: Boolean,
    noWrap: Boolean,
    icon: String,
    iconRight: String,
    round: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    small: Boolean,
    big: Boolean,
    color: String,
    glossy: Boolean,
    compact: Boolean
  },
  computed: {
    size () {
      return `q-btn-${this.small ? 'small' : (this.big ? 'big' : 'standard')}`
    },
    shape () {
      return `q-btn-${this.round ? 'round' : 'rectangle'}`
    },
    isDisabled () {
      return this.disable || this.loading
    },
    classes () {
      const
        cls = [this.shape, this.size],
        color = this.toggled ? this.toggleColor : this.color

      if (this.toggled) {
        cls.push('q-btn-toggle-active')
      }
      if (this.compact) {
        cls.push('q-btn-compact')
      }

      if (this.flat) {
        cls.push('q-btn-flat')
      }
      else if (this.outline) {
        cls.push('q-btn-outline')
      }
      else if (this.push) {
        cls.push('q-btn-push')
      }

      this.isDisabled && cls.push('disabled')
      this.noCaps && cls.push('q-btn-no-uppercase')
      this.rounded && cls.push('q-btn-rounded')
      this.glossy && cls.push('glossy')

      if (color) {
        if (this.flat || this.outline) {
          cls.push(`text-${color}`)
        }
        else {
          cls.push(`bg-${color}`)
          cls.push(`text-white`)
        }
      }

      return cls
    }
  }
}
