import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import ValidateMixin from '../../mixins/validate.js'

export default Vue.extend({
  name: 'QField',

  mixins: [ ValidateMixin ],

  props: {
    label: String,
    stackLabel: Boolean,
    hint: String,
    hideHint: Boolean,
    prefix: String,
    suffix: String,

    color: String,
    bgColor: String,
    dark: Boolean,

    filled: Boolean,
    outlined: Boolean,
    borderless: Boolean,
    standout: Boolean,

    bottomSlots: Boolean,
    rounded: Boolean,
    dense: Boolean,
    itemAligned: Boolean,

    disable: Boolean,
    readonly: Boolean
  },

  data () {
    return {
      focused: false
    }
  },

  computed: {
    editable () {
      return this.disable !== true && this.readonly !== true
    },

    floatingLabel () {
      return this.stackLabel || this.focused || (this.innerValue !== void 0 && ('' + this.innerValue).length > 0)
    },

    hasBottom () {
      return this.bottomSlots === true || this.hint !== void 0 || this.rules !== void 0 || this.counter === true
    },

    classes () {
      return {
        [this.fieldClass]: this.fieldClass !== void 0,

        [`q-field--${this.styleType}`]: true,
        'q-field--rounded': this.rounded,

        'q-field--focused': this.focused === true || this.hasError === true,
        'q-field--float': this.floatingLabel || this.hasError === true,
        'q-field--labeled': this.label !== void 0,

        'q-field--dense': this.dense,
        'q-field--item-aligned q-item-type': this.itemAligned === true,
        'q-field--dark': this.dark === true,

        'q-field--with-bottom': this.hasBottom === true,
        'q-field--error': this.hasError === true,

        'q-field--readonly no-pointer-events': this.readonly === true,
        'disabled no-pointer-events': this.disable === true
      }
    },

    styleType () {
      if (this.filled === true) { return 'filled' }
      if (this.outlined === true) { return 'outlined' }
      if (this.borderless === true) { return 'borderless' }
      if (this.standout === true) { return 'standout' }
      return 'standard'
    },

    contentClass () {
      const cls = []

      if (this.hasError) {
        cls.push('text-negative')
      }
      else if (this.color !== void 0) {
        cls.push('text-' + this.color)
      }

      if (this.bgColor !== void 0) {
        cls.push(`bg-${this.bgColor}`)
      }

      return cls
    }
  },

  methods: {
    __getContent (h) {
      return [

        this.$slots.prepend !== void 0 ? h('div', {
          staticClass: 'q-field__prepend q-field__marginal row no-wrap items-center',
          key: 'prepend'
        }, this.$slots.prepend) : null,

        h('div', {
          staticClass: 'q-field__control-container col relative-position row no-wrap q-anchor--skip'
        }, [
          this.label !== void 0 ? h('div', {
            staticClass: 'q-field__label no-pointer-events absolute ellipsis'
          }, [ this.label ]) : null,

          this.prefix !== void 0 && this.prefix !== null ? h('div', {
            staticClass: 'q-field__prefix no-pointer-events row items-center'
          }, [ this.prefix ]) : null,

          this.__getControl !== void 0
            ? this.__getControl(h)
            : null,

          this.suffix !== void 0 && this.suffix !== null ? h('div', {
            staticClass: 'q-field__suffix no-pointer-events row items-center'
          }, [ this.suffix ]) : null
        ].concat(
          this.__getDefaultSlot !== void 0
            ? this.__getDefaultSlot(h)
            : this.$slots.default
        )),

        this.hasError === true
          ? h('div', {
            staticClass: 'q-field__append q-field__marginal row no-wrap items-center',
            key: 'error'
          }, [ h(QIcon, { props: { name: 'error', color: 'negative' } }) ])
          : null,

        this.__getInnerAppend !== void 0
          ? h('div', {
            staticClass: 'q-field__append q-field__marginal row no-wrap items-center q-popup--skip',
            key: 'inner-append'
          }, this.__getInnerAppend(h))
          : null,

        this.$slots.append !== void 0
          ? h('div', {
            staticClass: 'q-field__append q-field__marginal row no-wrap items-center',
            key: 'append'
          }, this.$slots.append)
          : null,

        this.__getLocalMenu !== void 0
          ? this.__getLocalMenu(h)
          : null

      ]
    },

    __getBottom (h) {
      if (this.hasBottom !== true) { return }

      let msg, key

      if (this.hasError === true) {
        if (this.computedErrorMessage !== void 0) {
          msg = [ h('div', [ this.computedErrorMessage ]) ]
          key = this.computedErrorMessage
        }
        else {
          msg = this.$slots.error
          key = 'q--slot-error'
        }
      }
      else if (this.hideHint !== true || this.focused === true) {
        if (this.hint !== void 0) {
          msg = [ h('div', [ this.hint ]) ]
          key = this.hint
        }
        else {
          msg = this.$slots.hint
          key = 'q--slot-hint'
        }
      }

      return h('div', {
        staticClass: 'q-field__bottom absolute-bottom row items-start relative-position'
      }, [
        h('transition', { props: { name: 'q-transition--field-message' } }, [
          h('div', {
            staticClass: 'q-field__messages col',
            key
          }, msg)
        ]),

        this.counter === true || this.$slots.counter !== void 0 ? h('div', {
          staticClass: 'q-field__counter'
        }, this.$slots.counter || [ this.computedCounter ]) : null
      ])
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-field row no-wrap items-start',
      class: this.classes
    }, [
      this.$slots.before !== void 0 ? h('div', {
        staticClass: 'q-field__before q-field__marginal row no-wrap items-center'
      }, this.$slots.before) : null,

      h('div', {
        staticClass: 'q-field__inner relative-position col self-stretch column justify-center'
      }, [
        h('div', {
          ref: 'control',
          staticClass: 'q-field__control relative-position row no-wrap',
          class: this.contentClass,
          on: this.controlEvents
        }, this.__getContent(h)),

        this.__getBottom(h)
      ]),

      this.$slots.after !== void 0 ? h('div', {
        staticClass: 'q-field__after q-field__marginal row no-wrap items-center'
      }, this.$slots.after) : null
    ])
  }
})
