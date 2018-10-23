import Vue from 'vue'

export default Vue.extend({
  name: 'QField',

  fieldOptions: {
    classes: null
  },

  props: {
    label: String,
    stackLabel: Boolean,
    prefix: String,
    suffix: String,

    color: String,
    bgColor: String,
    dark: Boolean,

    filled: Boolean,
    outlined: Boolean,
    borderless: Boolean,
    standout: Boolean,

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
      return this.stackLabel || this.focused || (this.value && this.value.length > 0)
    },

    classes () {
      return {
        [this.$options.fieldOptions.classes]: this.$options.fieldOptions.classes,

        [`q-field--${this.styleType}`]: true,
        'q-field--rounded': this.rounded,

        'q-field--focused': this.focused,
        'q-field--float': this.floatingLabel,
        'q-field--labeled': this.label !== void 0,

        'q-field--dense': this.dense,
        'q-field--item-aligned q-item-type': this.itemAligned === true,
        'q-field--dark': this.dark === true,

        'q-field--disable no-pointer-events': this.editable !== true,
        'disabled': this.disable === true
      }
    },

    styleType () {
      if (this.filled) { return 'filled' }
      if (this.outlined) { return 'outlined' }
      if (this.borderless) { return 'borderless' }
      if (this.standout) { return 'standout' }
      return 'standard'
    },

    contentClass () {
      return {
        [`text-${this.color}`]: this.color,
        [`bg-${this.bgColor}`]: this.bgColor
      }
    }
  },

  methods: {
    __getContent (h) {
      return [

        this.$slots.prepend !== void 0 ? h('div', {
          staticClass: 'q-field__prepend q-field__marginal row no-wrap items-center'
        }, this.$slots.prepend) : null,

        h('div', {
          staticClass: 'q-field__control-container col relative-position row no-wrap'
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
        ].concat(this.$slots.default)),

        this.$slots.append !== void 0 ? h('div', {
          staticClass: 'q-field__append q-field__marginal row no-wrap items-center'
        }, this.$slots.append) : null

      ]
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-field row no-wrap items-start',
      'class': this.classes
    }, [
      this.$slots.before !== void 0 ? h('div', {
        staticClass: 'q-field__before q-field__marginal row no-wrap items-center'
      }, this.$slots.before) : null,

      h('div', {
        staticClass: 'q-field__inner col self-stretch column justify-center'
      }, [

        h('div', {
          staticClass: 'q-field__control relative-position row no-wrap',
          'class': this.contentClass
        }, this.__getContent(h)),

        (this.$slots.message !== void 0 || this.$slots.counter !== void 0) ? h('div', {
          staticClass: 'q-field__bottom row items-start'
        }, [
          h('div', {
            staticClass: 'q-field__messages-container col'
          }, [
            this.$slots.message !== void 0 ? h('div', {
              staticClass: 'q-field__messages'
            }, this.$slots.message) : null
          ]),

          this.counter !== void 0 ? h('div', {
            staticClass: 'q-field__counter'
          }, [ this.computedCounter ]) : null
        ]) : null

      ]),

      this.$slots.after !== void 0 ? h('div', {
        staticClass: 'q-field__after q-field__marginal row no-wrap items-center'
      }, this.$slots.after) : null
    ])
  }
})
