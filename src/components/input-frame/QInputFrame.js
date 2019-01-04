import FrameMixin from '../../mixins/input-frame.js'
import ParentFieldMixin from '../../mixins/parent-field.js'
import QIcon from '../icon/QIcon.js'

export default {
  name: 'QInputFrame',
  mixins: [FrameMixin, ParentFieldMixin],
  props: {
    focused: Boolean,
    length: Number,
    focusable: Boolean,
    additionalLength: Boolean
  },
  computed: {
    hasStackLabel () {
      return typeof this.stackLabel === 'string' && this.stackLabel.length > 0
    },
    hasLabel () {
      return this.hasStackLabel || (typeof this.floatLabel === 'string' && this.floatLabel.length > 0)
    },
    label () {
      return this.hasStackLabel ? this.stackLabel : this.floatLabel
    },
    addonClass () {
      return {
        'q-if-addon-visible': !this.hasLabel || this.labelIsAbove
      }
    },
    classes () {
      const cls = [{
        'q-if-has-label': this.label,
        'q-if-focused': this.focused,
        'q-if-error': this.hasError,
        'q-if-warning': this.hasWarning,
        'q-if-disabled': this.disable,
        'q-if-readonly': this.readonly,
        'q-if-focusable': this.focusable && !this.disable,
        'q-if-inverted': this.isInverted,
        'q-if-inverted-light': this.isInvertedLight,
        'q-if-light-color': this.lightColor,
        'q-if-dark': this.dark,
        'q-if-hide-underline': this.isHideUnderline,
        'q-if-standard': this.isStandard,
        'q-if-has-content': this.hasContent
      }]

      const color = this.hasError ? 'negative' : (this.hasWarning ? 'warning' : this.color)

      if (this.isInverted) {
        cls.push(`bg-${color}`)
        cls.push(`text-${this.isInvertedLight ? 'black' : 'white'}`)
      }
      else if (color) {
        cls.push(`text-${color}`)
      }

      return cls
    }
  },
  methods: {
    __onClick (e) {
      this.$emit('click', e)
    },
    __onMouseDown (e) {
      !this.disable && this.$nextTick(() => this.$emit('focus', e))
    },
    __additionalHidden (item, hasError, hasWarning, length) {
      if (item.condition !== void 0) {
        return item.condition === false
      }
      return (
        (item.content !== void 0 && !item.content === (length > 0)) ||
        (item.error !== void 0 && !item.error === hasError) ||
        (item.warning !== void 0 && !item.warning === hasWarning)
      )
    },
    __baHandler (evt, item) {
      if (!item.allowPropagation) {
        evt.stopPropagation()
      }
      if (item.handler) {
        item.handler(evt)
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-if row no-wrap relative-position',
      'class': this.classes,
      attrs: { tabindex: this.focusable && !this.disable ? 0 : -1 },
      on: { click: this.__onClick }
    }, [
      h('div', { staticClass: 'q-if-baseline' }, '|'),

      (this.before && this.before.map(item => {
        return h(QIcon, {
          key: `b${item.icon}`,
          staticClass: 'q-if-control q-if-control-before',
          'class': [item.class, {
            hidden: this.__additionalHidden(item, this.hasError, this.hasWarning, this.length)
          }],
          props: {
            name: item.icon
          },
          nativeOn: {
            mousedown: this.__onMouseDown,
            touchstart: this.__onMouseDown,
            click: e => { this.__baHandler(e, item) }
          }
        })
      })) || void 0,

      h('div', {
        staticClass: 'q-if-inner col column q-popup--skip'
      }, [
        h('div', { staticClass: 'row no-wrap relative-position' }, [
          (this.prefix && h('span', {
            staticClass: 'q-if-addon q-if-addon-left',
            'class': this.addonClass,
            domProps: {
              innerHTML: this.prefix
            }
          })) || void 0,

          (this.hasLabel && h('div', {
            staticClass: 'q-if-label',
            'class': { 'q-if-label-above': this.labelIsAbove }
          }, [
            h('div', {
              staticClass: 'q-if-label-inner ellipsis',
              domProps: { innerHTML: this.label }
            })
          ])) || void 0
        ].concat(this.$slots.default).concat([
          (this.suffix && h('span', {
            staticClass: 'q-if-addon q-if-addon-right',
            'class': this.addonClass,
            domProps: {
              innerHTML: this.suffix
            }
          })) || void 0
        ])),
        (this.hasLabel && h('div', {
          staticClass: 'q-if-label-spacer',
          domProps: {
            innerHTML: this.label
          }
        })) || void 0
      ]),

      (this.after && this.after.map(item => {
        return h(QIcon, {
          key: `a${item.icon}`,
          staticClass: 'q-if-control',
          'class': [item.class, {
            hidden: this.__additionalHidden(item, this.hasError, this.hasWarning, this.length)
          }],
          props: {
            name: item.icon
          },
          nativeOn: {
            mousedown: this.__onMouseDown,
            touchstart: this.__onMouseDown,
            click: e => { this.__baHandler(e, item) }
          }
        })
      })) || void 0
    ].concat(this.$slots.after))
  }
}
