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
    contentStyle: [Array, String, Object]
  },
  data () {
    return {
      showing: this.value
    }
  },
  watch: {
    value (val) {
      this.$refs.popover[val ? 'show' : 'hide']()
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
            anchor: 'bottom right',
            self: 'top right'
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
        [ this.$slots.default ]
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
        props: {
          loading: this.loading,
          disable: this.disable,
          noCaps: this.noCaps,
          noWrap: this.noWrap,
          icon: this.icon,
          label: this.label,
          iconRight: this.split ? this.iconRight : null,
          outline: this.outline,
          flat: this.flat,
          rounded: this.rounded,
          push: this.push,
          size: this.size,
          color: this.color,
          textColor: this.textColor,
          glossy: this.glossy,
          dense: this.dense,
          noRipple: this.noRipple,
          waitForRipple: this.waitForRipple
        },
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
      return this.$refs.popover.toggle()
    },
    show () {
      return this.$refs.popover.show()
    },
    hide () {
      return this.$refs.popover.hide()
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.value) {
        this.$refs.popover.show()
      }
    })
  }
}
