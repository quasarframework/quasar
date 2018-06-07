import { QBtn } from '../btn'
import FabMixin from './fab-mixin'

export default {
  name: 'QFabAction',
  mixins: [FabMixin],
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  inject: {
    __qFabClose: {
      default () {
        console.error('QFabAction needs to be child of QFab')
      }
    }
  },
  methods: {
    click (e) {
      this.__qFabClose().then(() => {
        this.$emit('click', e)
      })
    }
  },
  render (h) {
    return h(QBtn, {
      props: {
        fabMini: true,
        outline: this.outline,
        push: this.push,
        flat: this.flat,
        color: this.color,
        textColor: this.textColor,
        glossy: this.glossy,
        icon: this.icon
      },
      on: {
        click: this.click
      }
    }, this.$slots.default)
  }
}
