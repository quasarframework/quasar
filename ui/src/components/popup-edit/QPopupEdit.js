import Vue from 'vue'

import QMenu from '../menu/QMenu.js'
import QBtn from '../btn/QBtn.js'
import clone from '../../utils/clone.js'
import { isDeepEqual } from '../../utils/is.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QPopupEdit',

  props: {
    value: {
      required: true
    },
    title: String,
    buttons: Boolean,
    labelSet: String,
    labelCancel: String,

    persistent: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    validate: {
      type: Function,
      default: () => true
    },

    contentClass: String,
    contentStyle: [String, Array, Object],

    disable: Boolean
  },

  data () {
    return {
      initialValue: ''
    }
  },

  computed: {
    classes () {
      return 'q-popup-edit' +
        (this.contentClass ? ' ' + this.contentClass : '')
    }
  },

  methods: {
    set () {
      if (this.__hasChanged()) {
        if (this.validate(this.value) === false) {
          return
        }
        this.$emit('save', this.value, this.initialValue)
      }
      this.__close()
    },

    cancel () {
      if (this.__hasChanged()) {
        this.$emit('cancel', this.value, this.initialValue)
        this.$emit('input', this.initialValue)
      }
      this.__close()
    },

    __hasChanged () {
      return !isDeepEqual(this.value, this.initialValue)
    },

    __close () {
      this.validated = true
      this.$refs.menu.hide()
    },

    __reposition () {
      this.$nextTick(() => {
        this.$refs.menu.updatePosition()
      })
    },

    __getContent (h) {
      const
        child = [].concat(slot(this, 'default')),
        title = this.$scopedSlots.title !== void 0
          ? this.$scopedSlots.title()
          : this.title

      title && child.unshift(
        h('div', { staticClass: 'q-dialog__title q-mt-sm q-mb-sm' }, [ title ])
      )

      this.buttons === true && child.push(
        h('div', { staticClass: 'q-popup-edit__buttons row justify-center no-wrap' }, [
          h(QBtn, {
            props: {
              flat: true,
              color: this.color,
              label: this.labelCancel || this.$q.lang.label.cancel
            },
            on: { click: this.cancel }
          }),
          h(QBtn, {
            props: {
              flat: true,
              color: this.color,
              label: this.labelSet || this.$q.lang.label.set
            },
            on: { click: this.set }
          })
        ])
      )

      return child
    }
  },

  render (h) {
    if (this.disable === true) { return }

    return h(QMenu, {
      ref: 'menu',
      props: {
        contentClass: this.classes,
        contentStyle: this.contentStyle,
        cover: true,
        persistent: this.persistent,
        noFocus: true
      },
      on: {
        show: () => {
          this.$emit('show')
          this.validated = false
          this.initialValue = clone(this.value)
          this.watcher = this.$watch('value', this.__reposition)
        },
        'before-hide': () => {
          this.watcher()

          if (this.validated === false && this.__hasChanged()) {
            this.$emit('cancel', this.value, this.initialValue)
            this.$emit('input', this.initialValue)
          }
        },
        hide: () => {
          this.$emit('hide')
        },
        keyup: e => {
          e.keyCode === 13 && this.set()
        }
      }
    }, this.__getContent(h))
  }
})
