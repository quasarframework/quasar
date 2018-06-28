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
    readonly: Boolean,
    noFocus: Boolean,
    checkedIcon: String,
    uncheckedIcon: String
  },
  computed: {
    classes () {
      return [
        this.__kebabTag,
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
          : (this.dark ? 'light' : 'faded')

        return `text-${color}`
      }
    },
    focusable () {
      return !this.noFocus && !this.disable && !this.readonly
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
      directives: this.__kebabTag === 'q-toggle' && !this.disable && !this.readonly
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
        this.$q.platform.is.desktop
          ? h('div', {
            staticClass: 'q-focus-helper',
            'class': this.__kebabTag === 'q-radio' ? 'q-focus-helper-round' : 'q-focus-helper-rounded'
          })
          : null,
        this.__getContent(h)
      ]),

      this.label
        ? h('span', {
          staticClass: 'q-option-label',
          domProps: { innerHTML: this.label }
        })
        : null,

      this.$slots.default
    ])
  }
}
