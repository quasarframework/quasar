import QModal from '../modal/QModal.js'
import QIcon from '../icon/QIcon.js'
import QList from '../list/QList.js'
import QItem from '../list/QItem.js'
import QItemSide from '../list/QItemSide.js'
import QItemMain from '../list/QItemMain.js'
import QItemSeparator from '../list/QItemSeparator.js'
import { getEventKey } from '../../utils/event.js'

export default {
  name: 'QActionSheet',
  props: {
    value: Boolean,
    title: String,
    grid: Boolean,
    actions: Array,
    dismissLabel: String
  },
  render (h) {
    let title = this.$slots.title || this.title

    return h(QModal, {
      ref: 'modal',
      props: {
        value: this.value,
        position: 'bottom'
      },
      on: {
        input: val => {
          this.$emit('input', val)
        },
        show: () => {
          this.$emit('show')
        },
        hide: () => {
          this.$emit('hide')
        },
        dismiss: () => {
          this.$emit('cancel')
        },
        'escape-key': () => {
          this.$emit('escape-key')
        }
      }
    }, [
      (title && h('div', {
        staticClass: 'q-actionsheet-title column justify-center'
      }, [ title ])) || void 0,

      h(
        'div',
        { staticClass: 'q-actionsheet-body scroll' },
        this.actions
          ? [
            this.grid
              ? h('div', { staticClass: 'q-actionsheet-grid row wrap items-center justify-between' }, this.__getActions(h))
              : h(QList, { staticClass: 'no-border', props: { link: true } }, this.__getActions(h))
          ]
          : this.$slots.default
      )
    ])
  },
  methods: {
    show () {
      return this.$refs.modal.show()
    },
    hide () {
      return this.$refs.modal ? this.$refs.modal.hide() : Promise.resolve()
    },
    __getActions (h) {
      return this.actions.map(action => action.label
        ? h(this.grid ? 'div' : QItem, {
          staticClass: this.grid
            ? 'q-actionsheet-grid-item cursor-pointer relative-position column inline flex-center'
            : null,
          'class': action.classes,
          attrs: {
            tabindex: 0
          },
          [this.grid ? 'on' : 'nativeOn']: {
            click: () => this.__onOk(action),
            keyup: e => {
              if (getEventKey(e) === /* Enter */ 13) {
                this.__onOk(action)
              }
            }
          }
        }, this.grid
          ? [
            action.icon ? h(QIcon, { props: { name: action.icon, color: action.color } }) : null,
            action.avatar ? h('img', { domProps: { src: action.avatar }, staticClass: 'avatar' }) : null,
            h('span', [ action.label ])
          ]
          : [
            h(QItemSide, { props: { icon: action.icon, color: action.color, avatar: action.avatar } }),
            h(QItemMain, { props: { inset: true, label: action.label } })
          ]
        )
        : h(QItemSeparator, { staticClass: 'col-12' })
      )
    },
    __onOk (action) {
      this.hide().then(() => {
        if (typeof action.handler === 'function') {
          action.handler()
        }
        this.$emit('ok', action)
      })
    },
    __onCancel () {
      this.hide().then(() => {
        this.$emit('cancel')
      })
    },
    __onKeyCancel (e) {
      if (getEventKey(e) === /* Enter */ 13) {
        this.__onCancel()
      }
    }
  }
}
