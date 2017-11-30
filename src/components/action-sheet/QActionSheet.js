import { QModal } from '../modal'
import { QIcon } from '../icon'
import { QList, QItem, QItemSide, QItemMain, QItemSeparator } from '../list'

export default {
  name: 'q-action-sheet',
  props: {
    value: Boolean,
    title: String,
    grid: Boolean,
    actions: Array,
    dismissLabel: String
  },
  computed: {
    contentCss () {
      if (__THEME__ === 'ios') {
        return {backgroundColor: 'transparent'}
      }
    }
  },
  render (h) {
    let
      child = [],
      title = this.$slots.title || this.title

    if (title) {
      child.push(
        h('div', {
          staticClass: 'q-actionsheet-title column justify-center'
        }, [ title ])
      )
    }

    child.push(
      h(
        'div',
        { staticClass: 'q-actionsheet-body scroll' },
        this.actions
          ? [
            this.grid
              ? h('div', { staticClass: 'q-actionsheet-grid row wrap items-center justify-between' }, this.__getActions(h))
              : h(QList, { staticClass: 'no-border', props: { link: true } }, this.__getActions(h))
          ]
          : [ this.$slots.default ]
      )
    )

    if (__THEME__ === 'ios') {
      child = [
        h('div', { staticClass: 'q-actionsheet' }, child),
        h('div', { staticClass: 'q-actionsheet' }, [
          h(QItem, {
            props: {
              link: true
            },
            domProps: {
              tabindex: '0'
            },
            on: {
              click: this.__onCancel,
              keydown: this.__onCancel
            }
          }, [
            h(QItemMain, { staticClass: 'text-center text-primary' }, [
              this.dismissLabel || this.$q.i18n.label.cancel
            ])
          ])
        ])
      ]
    }

    return h(QModal, {
      ref: 'modal',
      props: {
        value: this.value,
        position: 'bottom',
        contentCss: this.contentCss
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
          this.__onCancel()
        },
        'escape-key': () => {
          this.hide().then(() => {
            this.$emit('escape-key')
            this.__onCancel()
          })
        }
      }
    }, child)
  },
  methods: {
    show () {
      return this.$refs.modal.show()
    },
    hide () {
      return this.$refs.modal.hide()
    },
    __getActions (h) {
      return this.actions.map(action => action.label
        ? h(this.grid ? 'div' : QItem, {
          staticClass: this.grid
            ? 'q-actionsheet-grid-item cursor-pointer relative-position column inline flex-center'
            : null,
          'class': action.classes,
          domProps: { tabindex: '0' },
          on: {
            click: () => this.__onOk(action),
            keydown: (e) => this.__onOk(action)
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
        this.$emit('ok', action)
      })
    },
    __onCancel () {
      this.hide().then(() => {
        this.$emit('cancel')
      })
    }
  }
}
