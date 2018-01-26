import { getEventKey } from '../utils/event'

export default {
  props: {
    value: {
      required: true
    },
    label: String,
    leftLabel: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    keepColor: Boolean,
    dark: Boolean,
    disable: Boolean,
    noFocus: Boolean,
    checkedIcon: String,
    uncheckedIcon: String
  },
  computed: {
    classes () {
      return [
        this.$options._componentTag,
        {
          disabled: this.disable,
          reverse: this.leftLabel,
          'q-focusable': this.focusable
        }
      ]
    },
    innerClasses () {
      if (this.isTrue || this.isIndeterminate) {
        return ['active', `text-${this.color}`]
      }
      else {
        const color = this.keepColor
          ? this.color
          : (this.dark ? 'light' : 'dark')

        return `text-${color}`
      }
    },
    focusable () {
      return !this.noFocus && !this.disable
    },
    tabindex () {
      return this.focusable ? 0 : -1
    }
  },
  methods: {
    __update (value) {
      const ref = this.$refs.ripple
      if (ref) {
        ref.classList.add('active')
        setTimeout(() => {
          ref.classList.remove('active')
        }, 10)
      }

      this.$emit('input', value)
      this.$nextTick(() => {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
      })
    },
    __handleKeyDown (e) {
      if ([13, 32].includes(getEventKey(e))) {
        this.toggle(e, false)
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-option cursor-pointer no-outline row inline no-wrap items-center',
      'class': this.classes,
      attrs: { tabindex: this.tabindex },
      on: {
        click: this.toggle,
        focus: () => { this.$emit('focus') },
        blur: () => { this.$emit('blur') },
        keydown: this.__handleKeyDown
      },
      directives: this.$options._componentTag === 'q-toggle'
        ? [{
          name: 'touch-swipe',
          modifiers: { horizontal: true },
          value: this.__swipe
        }]
        : null
    }, [
      h('div', {
        staticClass: 'q-option-inner relative-position',
        'class': this.innerClasses
      }, [
        h('input', {
          attrs: { type: 'checkbox' },
          on: { change: this.toggle }
        }),
        h('div', { staticClass: 'q-focus-helper' }),
        this.__getContent(h)
      ]),

      this.label
        ? h('span', {
          staticClass: 'q-option-label',
          'class': {
            'text-light': this.dark
          },
          domProps: { innerHTML: this.label }
        })
        : null,

      this.$slots.default
    ])
  }
}
