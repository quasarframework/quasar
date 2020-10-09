import { h, defineComponent } from 'vue'

import QMenu from '../menu/QMenu.js'
import QBtn from '../btn/QBtn.js'

import clone from '../../utils/clone.js'
import { isDeepEqual } from '../../utils/is.js'
import { hSlot } from '../../utils/render.js'
import { isKeyCode } from '../../utils/key-composition.js'

export default defineComponent({
  name: 'QPopupEdit',

  props: {
    modelValue: {
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
    /* end of menu props */

    disable: Boolean
  },

  emits: [
    'update:modelValue', 'save', 'cancel',
    'before-show', 'show', 'before-hide', 'hide'
  ],

  data () {
    return {
      initialValue: ''
    }
  },

  computed: {
    defaultSlotScope () {
      return {
        initialValue: this.initialValue,
        value: this.modelValue,
        emitValue: this.__emitValue,
        validate: this.validate,
        set: this.set,
        cancel: this.cancel
      }
    }
  },

  methods: {
    set () {
      if (this.__hasChanged() === true) {
        if (this.validate(this.value) === false) {
          return
        }
        this.$emit('save', this.value, this.initialValue)
      }
      this.__close()
    },

    cancel () {
      if (this.__hasChanged() === true) {
        this.$emit('update:modelValue', this.initialValue)
        this.$emit('cancel', this.value, this.initialValue)
      }
      this.__close()
    },

    show (e) {
      this.initialValue = this.modelValue
      this.$refs.menu && this.$refs.menu.show(e)
    },

    hide (e) {
      this.$refs.menu && this.$refs.menu.hide(e)
    },

    __hasChanged () {
      return isDeepEqual(this.value, this.initialValue) === false
    },

    __emitValue (val) {
      if (this.disable !== true) {
        this.$emit('update:modelValue', val)
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

    __getContent () {
      const
        title = hSlot(this, 'title', this.title),
        child = this.$slots.default === void 0
          ? []
          : this.$slots.default(this.defaultSlotScope).slice()

      title && child.unshift(
        h('div', { class: 'q-dialog__title q-mt-sm q-mb-sm' }, [ title ])
      )

      this.buttons === true && child.push(
        h('div', { class: 'q-popup-edit__buttons row justify-center no-wrap' }, [
          h(QBtn, {
            flat: true,
            color: this.color,
            label: this.labelCancel || this.$q.lang.label.cancel,
            onClick: this.cancel
          }),
          h(QBtn, {
            flat: true,
            color: this.color,
            label: this.labelSet || this.$q.lang.label.set,
            onClick: this.set
          })
        ])
      )

      return child
    },

    __onBeforeShow () {
      this.validated = false
      this.initialValue = clone(this.modelValue)
      this.watcher = this.$watch('modelValue', this.__reposition)
      this.$emit('before-show')
    },

    __onShow () {
      this.$emit('show')
    },

    __onBeforeHide () {
      this.watcher()

      if (this.validated === false && this.__hasChanged() === true) {
        if (this.autoSave === true && this.validate(this.modelValue) === true) {
          this.$emit('save', this.modelValue, this.initialValue)
        }
        else {
          this.$emit('cancel', this.modelValue, this.initialValue)
          this.$emit('update:modelValue', this.initialValue)
        }
      }

      this.$emit('before-hide')
    },

    __onHide () {
      this.$emit('hide')
    },

    __onKeyup (e) {
      isKeyCode(e, 13) === true && this.set()
    }
  },

  render () {
    if (this.disable === true) { return }

    return h(QMenu, {
      ref: 'menu',
      class: 'q-popup-edit',
      cover: this.cover,
      'onBefore-show': this.__onBeforeShow,
      onShow: this.__onShow,
      'onBefore-hide': this.__onBeforeHide,
      onHide: this.__onHide,
      'onEscape-key': this.cancel
    }, this.__getContent)
  }
})
