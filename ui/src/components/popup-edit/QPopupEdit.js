import Vue from 'vue'

import QMenu from '../menu/QMenu.js'
import QBtn from '../btn/QBtn.js'

import AttrsMixin from '../../mixins/attrs.js'

import clone from '../../utils/clone.js'
import { isDeepEqual } from '../../utils/is.js'
import { slot } from '../../utils/slot.js'
import { isKeyCode } from '../../utils/key-composition.js'
import cache from '../../utils/cache.js'

export default Vue.extend({
  name: 'QPopupEdit',

  mixins: [ AttrsMixin ],

  props: {
    value: {
      required: true
    },
    title: String,
    buttons: Boolean,
    labelSet: String,
    labelCancel: String,

    color: {
      type: String,
      default: 'primary'
    },
    validate: {
      type: Function,
      default: () => true
    },

    autoSave: Boolean,

    /* menu props overrides */
    cover: {
      type: Boolean,
      default: true
    },
    contentClass: String,
    /* end of menu props */

    disable: Boolean
  },

  data () {
    return {
      modelChanged: false,
      model: null
    }
  },

  computed: {
    classes () {
      return 'q-popup-edit' +
        (this.contentClass !== void 0 ? ` ${this.contentClass}` : '')
    },

    modelValue () {
      return this.modelChanged === true ? this.model : this.value
    },

    initialValue () {
      return this.modelChanged !== true ? this.model : this.value
    },

    defaultSlotScope () {
      const acc = {
        initialValue: this.initialValue,
        updatePosition: this.__reposition,
        emitValue: this.__changeModel,
        validate: this.validate,
        set: this.set,
        cancel: this.cancel
      }

      Object.defineProperty(acc, 'value', {
        get: () => this.modelValue,
        set: this.__changeModel
      })

      return acc
    },

    menuProps () {
      return {
        ...this.qAttrs,
        cover: this.cover,
        contentClass: this.classes
      }
    }
  },

  methods: {
    set () {
      if (this.validate(this.modelValue) !== true) {
        return
      }
      if (this.__hasChanged() === true) {
        this.$emit('save', this.modelValue, this.initialValue)
        this.modelChanged === true && this.$emit('input', this.modelValue)
      }
      this.__close()
    },

    cancel () {
      if (this.__hasChanged() === true) {
        this.$emit('cancel', this.modelValue, this.initialValue)
        this.modelChanged !== true && this.$emit('input', this.initialValue)
      }
      this.__close()
    },

    show (e) {
      this.$refs.menu !== void 0 && this.$refs.menu.show(e)
    },

    hide (e) {
      this.$refs.menu !== void 0 && this.$refs.menu.hide(e)
    },

    __hasChanged () {
      return isDeepEqual(this.modelValue, this.initialValue) === false
    },

    __changeModel (val) {
      if (this.disable !== true) {
        this.model = val
        this.modelChanged = true
      }
    },

    __close () {
      this.validated = true
      this.$refs.menu.showing === true && this.$refs.menu.hide()
    },

    __reposition () {
      this.$nextTick(() => {
        this.$refs.menu.updatePosition()
      })
    },

    __getContent (h) {
      const
        title = slot(this, 'title', this.title),
        child = this.$scopedSlots.default === void 0
          ? []
          : [].concat(this.$scopedSlots.default(this.defaultSlotScope))

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
            on: cache(this, 'cancel', { click: this.cancel })
          }),
          h(QBtn, {
            props: {
              flat: true,
              color: this.color,
              label: this.labelSet || this.$q.lang.label.set
            },
            on: cache(this, 'ok', { click: this.set })
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
      props: this.menuProps,
      on: cache(this, 'menu', {
        'before-show': () => {
          this.validated = false
          this.modelChanged = false
          this.model = clone(this.value)
          this.watcher = this.$watch('value', this.__reposition)
          this.$emit('before-show')
        },

        show: () => {
          this.$emit('show')
        },

        'escape-key': this.cancel,

        'before-hide': () => {
          this.watcher()

          if (this.validated === false && this.__hasChanged() === true) {
            if (this.autoSave === true && this.validate(this.model) === true) {
              this.$emit('save', this.modelValue, this.initialValue)
              this.modelChanged === true && this.$emit('input', this.modelValue)
            }
            else {
              this.$emit('cancel', this.modelValue, this.initialValue)
              this.modelChanged !== true && this.$emit('input', this.initialValue)
            }
          }

          this.$emit('before-hide')
        },

        hide: () => {
          this.$emit('hide')
        },

        keyup: e => {
          isKeyCode(e, 13) === true && this.set()
        }
      })
    }, this.__getContent(h))
  }
})
