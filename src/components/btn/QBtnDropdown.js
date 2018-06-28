import BtnMixin from './btn-mixin'
import QBtn from './QBtn'
import QBtnGroup from './QBtnGroup'
import { QPopover } from '../popover'

export default {
  name: 'QBtnDropdown',
  mixins: [BtnMixin],
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
      Icon = h(
        'QIcon',
        {
          props: {
            name: this.$q.icon.input.dropdown
          },
          staticClass: 'transition-generic',
          'class': {
            'rotate-180': this.showing,
            'on-right': !this.split,
            'q-btn-dropdown-arrow': !this.split
          }
        }
      ),
      Btn = h(QBtn, {
        props: Object.assign({}, this.$props, {
          iconRight: this.split ? this.iconRight : null
        }),
        'class': this.split ? 'q-btn-dropdown-current' : 'q-btn-dropdown q-btn-dropdown-simple',
        on: {
          click: e => {
            this.split && this.hide()
            if (!this.disable) {
              this.$emit('click', e)
            }
          }
        }
      }, this.split ? null : [ Icon, Popover ])

    if (!this.split) {
      return Btn
    }

    return h(
      QBtnGroup,
      {
        props: {
          outline: this.outline,
          flat: this.flat,
          rounded: this.rounded,
          push: this.push
        },
        staticClass: 'q-btn-dropdown q-btn-dropdown-split no-wrap q-btn-item'
      },
      [
        Btn,
        h(
          QBtn,
          {
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
              glossy: this.glossy,
              noRipple: this.noRipple,
              waitForRipple: this.waitForRipple
            },
            staticClass: 'q-btn-dropdown-arrow',
            on: { click: () => { this.toggle() } }
          },
          [ Icon ]
        ),
        [ Popover ]
      ]
    )
  },
  methods: {
    toggle () {
      return this.$refs.popover ? this.$refs.popover.toggle() : Promise.resolve()
    },
    show () {
      return this.$refs.popover ? this.$refs.popover.show() : Promise.resolve()
    },
    hide () {
      return this.$refs.popover ? this.$refs.popover.hide() : Promise.resolve()
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.value) {
        this.$refs.popover && this.$refs.popover.show()
      }
    })
  }
}
