import BtnMixin from './btn-mixin'

export default {
  name: 'q-btn-toggle',
  mixins: [BtnMixin],
  model: {
    prop: 'toggled',
    event: 'change'
  },
  props: {
    toggled: {
      type: Boolean,
      required: true
    },
    toggleColor: {
      type: String,
      required: true
    }
  },
  methods: {
    click (e) {
      clearTimeout(this.timer)

      if (this.isDisabled) {
        return
      }

      const trigger = () => {
        this.removeFocus(e)
        const state = !this.toggled
        this.$emit('change', state)
        this.$emit('click', e, state)
      }

      if (this.waitForRipple && this.hasRipple) {
        this.timer = setTimeout(trigger, 350)
      }
      else {
        trigger()
      }
    }
  },
  render (h) {
    return h('button', {
      staticClass: 'q-btn q-btn-toggle row inline flex-center q-focusable q-hoverable relative-position',
      'class': this.classes,
      style: this.style,
      on: { click: this.click },
      directives: this.hasRipple
        ? [{
          name: 'ripple',
          value: true
        }]
        : null
    }, [
      h('div', { staticClass: 'q-focus-helper' }),

      h('span', {
        staticClass: 'q-btn-inner row col flex-center',
        'class': {
          'no-wrap': this.noWrap,
          'text-no-wrap': this.noWrap
        }
      }, [
        this.icon
          ? h('q-icon', {
            'class': { 'on-left': this.label && !this.round },
            props: { name: this.icon }
          })
          : null,

        this.label && !this.round ? h('span', [ this.label ]) : null,

        this.$slots.default,

        this.iconRight && !this.round
          ? h('q-icon', {
            staticClass: 'on-right',
            props: { name: this.iconRight }
          })
          : null
      ])
    ])
  }
}
