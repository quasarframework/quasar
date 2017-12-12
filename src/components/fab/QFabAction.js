import { QBtn } from '../btn'
import FabMixin from './fab-mixin'

export default {
  name: 'q-fab-action',
  mixins: [FabMixin],
  inject: {
    __qFabClose: {
      default () {
        console.error('QFabAction needs to be child of QFab')
      }
    }
  },
  props: {
    icon: {
      type: String,
      required: true
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
        round: true,
        size: 'sm',
        outline: this.outline,
        push: this.push,
        flat: this.flat,
        color: this.color,
        glossy: this.glossy,
        icon: this.icon
      },
      on: {
        click: this.click
      }
    }, [
      this.$slots.default
    ])
  }
}
