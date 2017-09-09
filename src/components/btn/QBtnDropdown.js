import BtnMixin from './btn-mixin'
import QBtn from './QBtn.vue'
import QBtnGroup from './QBtnGroup'
import { QPopover } from '../popover'

export default {
  name: 'q-btn-dropdown',
  mixins: [BtnMixin],
  props: {
    label: String,
    split: Boolean
  },
  data () {
    return {
      opened: false
    }
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
            open: e => {
              this.opened = true
              this.$emit('open', e)
            },
            close: e => {
              this.opened = false
              this.$emit('close', e)
            }
          }
        },
        this.$slots.default
      ),
      Icon = h(
        'q-icon',
        {
          props: {
            name: 'arrow_drop_down'
          },
          staticClass: 'transition-generic',
          'class': {
            'rotate-180': this.opened,
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
            small: this.small,
            big: this.big,
            color: this.color,
            glossy: this.glossy,
            compact: this.compact
          },
          staticClass: `${this.split ? 'q-btn-dropdown-current' : 'q-btn-dropdown q-btn-dropdown-simple'}`,
          on: {
            click: e => {
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
              small: this.small,
              big: this.big,
              color: this.color,
              glossy: this.glossy
            },
            staticClass: 'q-btn-dropdown-arrow',
            on: {
              click: () => {
                if (!this.disable) {
                  this.$refs.popover.open()
                }
              }
            }
          },
          [Icon]
        ),
        child
      ]
    )
  },
  methods: {
    open () {
      this.$refs.popover.open()
    },
    close () {
      this.$refs.popover.close()
    }
  }
}
