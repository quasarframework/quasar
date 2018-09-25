import BtnMixin from './btn-mixin.js'
import QIcon from '../icon/QIcon.js'
import QBtn from './QBtn.js'
import QBtnGroup from './QBtnGroup.js'
import QPopover from '../popover/QPopover.js'

import Vue from 'vue'
export default Vue.extend({
  name: 'QBtnDropdown',

  mixins: [ BtnMixin ],

  props: {
    value: Boolean,
    split: Boolean,
    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object],
    popoverAnchor: {
      type: String,
      default: 'bottom right'
    },
    popoverSelf: {
      type: String,
      default: 'top right'
    }
  },

  data () {
    return {
      showing: this.value
    }
  },

  watch: {
    value (val) {
      this.$refs.popover && this.$refs.popover[val ? 'show' : 'hide']()
    }
  },

  render (h) {
    const
      Popover = h(
        QPopover,
        {
          ref: 'popover',
          props: {
            disable: this.disable,
            fit: true,
            anchorClick: !this.split,
            anchor: this.popoverAnchor,
            self: this.popoverSelf
          },
          'class': this.contentClass,
          style: this.contentStyle,
          on: {
            show: e => {
              this.showing = true
              this.$emit('show', e)
              this.$emit('input', true)
            },
            hide: e => {
              this.showing = false
              this.$emit('hide', e)
              this.$emit('input', false)
            }
          }
        },
        this.$slots.default
      ),
      Icon = h(QIcon, {
        props: {
          name: this.$q.icon.input.dropdown
        },
        staticClass: 'generic-transition',
        'class': {
          'rotate-180': this.showing,
          'on-right': !this.split,
          'q-btn-dropdown__arrow': !this.split
        }
      }),
      Btn = h(QBtn, {
        props: Object.assign({}, this.$props, {
          iconRight: this.split ? this.iconRight : null
        }),
        'class': this.split ? 'q-btn-dropdown--current' : 'q-btn-dropdown q-btn-dropdown--simple',
        on: {
          click: e => {
            this.split && this.hide()
            !this.disable && this.$emit('click', e)
          }
        }
      }, this.split ? null : [ Icon, Popover ])

    if (!this.split) {
      return Btn
    }

    return h(QBtnGroup, {
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push,
        unelevated: this.unelevated
      },
      staticClass: 'q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item',
      'class': { 'self-stretch no-border-radius': this.stretch }
    },
    [
      Btn,
      h(QBtn, {
        props: {
          disable: this.disable,
          outline: this.outline,
          flat: this.flat,
          rounded: this.rounded,
          push: this.push,
          size: this.size,
          color: this.color,
          textColor: this.textColor,
          dense: this.dense,
          noRipple: this.noRipple
        },
        staticClass: 'q-btn-dropdown__arrow',
        on: { click: this.toggle }
      }, [ Icon ]),
      [ Popover ]
    ])
  },

  methods: {
    toggle () {
      this.$refs.popover && this.$refs.popover.toggle()
    },
    show () {
      this.$refs.popover && this.$refs.popover.show()
    },
    hide () {
      this.$refs.popover && this.$refs.popover.hide()
    }
  },

  mounted () {
    this.value && this.show()
  }
})
