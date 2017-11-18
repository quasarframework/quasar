import BtnMixin from './btn-mixin'
import QBtn from './QBtn'
import QBtnGroup from './QBtnGroup'
import { QPopover } from '../popover'
import ModelToggleMixin from '../../mixins/model-toggle'

export default {
  name: 'q-btn-dropdown',
  mixins: [BtnMixin, ModelToggleMixin],
  props: {
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
              this.__updateModel(true)
              this.$emit('show', e)
            },
            hide: e => {
              this.__updateModel(false)
              this.$emit('hide', e)
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
                  this.$refs.popover.show()
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
    show () {
      return this.$refs.popover
        ? this.$refs.popover.show()
        : Promise.resolve()
    },
    hide () {
      return this.$refs.popover
        ? this.$refs.popover.hide()
        : Promise.resolve()
    }
  }
}
