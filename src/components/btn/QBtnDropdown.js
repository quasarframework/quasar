import BtnMixin from './btn-mixin'
import QBtn from './QBtn'
import QBtnGroup from './QBtnGroup'
import { QPopover } from '../popover'

export default {
  name: 'q-btn-dropdown',
  mixins: [BtnMixin],
  props: {
    value: Boolean,
    label: String,
    split: Boolean
  },
  render (h) {
    const
      Popover = h(
        QPopover,
        {
          ref: 'popover',
          props: {
            fit: true,
            anchorClick: !this.split,
            anchor: 'bottom right',
            self: 'top right'
          },
          on: {
            show: e => {
              this.$emit('show', e)
              this.$emit('input', true)
            },
            hide: e => {
              this.$emit('hide', e)
              this.$emit('input', false)
            }
          }
        },
        this.$slots.default
      ),
      Icon = h(
        'q-icon',
        {
          props: {
            name: this.$q.icon.btn.dropdown
          },
          staticClass: 'transition-generic',
          'class': {
            'rotate-180': this.showing,
            'on-right': !this.split,
            'q-btn-dropdown-arrow': !this.split
          }
        }
      ),
      child = [Popover]

    const getBtn = () => {
      return h(
        QBtn,
        {
          props: {
            disable: this.disable,
            noCaps: this.noCaps,
            noWrap: this.noWrap,
            icon: this.icon,
            label: this.label,
            iconRight: this.split ? this.iconRight : null,
            round: this.round,
            outline: this.outline,
            flat: this.flat,
            rounded: this.rounded,
            push: this.push,
            size: this.size,
            color: this.color,
            glossy: this.glossy,
            compact: this.compact,
            noRipple: this.noRipple,
            waitForRipple: this.waitForRipple
          },
          staticClass: `${this.split ? 'q-btn-dropdown-current' : 'q-btn-dropdown q-btn-dropdown-simple'}`,
          on: {
            click: e => {
              this.split && this.hide()
              if (!this.disable) {
                this.$emit('click', e)
              }
            }
          }
        },
        this.split ? null : child
      )
    }

    if (!this.split) {
      child.push(Icon)
      return getBtn()
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
        staticClass: 'q-btn-dropdown q-btn-dropdown-split no-wrap'
      },
      [
        getBtn(),
        h(
          QBtn,
          {
            props: {
              round: this.round,
              flat: this.flat,
              rounded: this.rounded,
              push: this.push,
              size: this.size,
              color: this.color,
              glossy: this.glossy,
              noRipple: this.noRipple,
              waitForRipple: this.waitForRipple
            },
            staticClass: 'q-btn-dropdown-arrow',
            on: {
              click: () => {
                if (!this.disable) {
                  this.toggle()
                }
              }
            }
          },
          [ Icon ]
        ),
        child
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
  }
}
