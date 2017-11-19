import { QModal } from '../modal'
import { QIcon } from '../icon'
import { QList, QItem, QItemSide, QItemMain } from '../list'
import ModelToggleMixin from '../../mixins/model-toggle'

export default {
  name: 'q-action-sheet',
  mixins: [ModelToggleMixin],
  props: {
    title: String,
    grid: Boolean,
    actions: Array
  },
  computed: {
    contentCss () {
      if (this.$q.theme === 'ios') {
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
          staticClass: 'modal-header'
        }, [ title ])
      )
    }

    child.push(
      h(
        'div',
        { staticClass: 'modal-body modal-scroll' },
        this.actions
          ? [
            this.grid
              ? h('div', { staticClass: 'q-action-sheet-gallery row wrap flex-center' }, this.__getActions(h))
              : h(QList, { staticClass: 'no-border', props: { link: true } }, this.__getActions(h))
          ]
          : [ this.$slots.default ]
      )
    )

    if (__THEME__ === 'ios') {
      child = [
        h('div', { staticClass: 'q-action-sheet' }, child),
        h('div', { staticClass: 'q-action-sheet' }, [
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
            h(QItemMain, { staticClass: 'text-center' }, [
              'Cancel'
            ])
          ])
        ])
      ]
    }

    return h(QModal, {
      ref: 'modal',
      props: {
        position: 'bottom',
        contentCss: this.contentCss
      },
      on: {
        dismiss: this.__onCancel,
        'escape-key': () => {
          this.hide().then(() => {
            this.$emit('escape-key')
            this.$emit('cancel')
          })
        }
      }
    }, child)
  },
  methods: {
    show () {
      if (this.showing) {
        return Promise.resolve()
      }

      return this.$refs.modal.show().then(() => {
        this.$emit('show')
        this.__updateModel(true)
      })
    },
    hide () {
      return this.showing
        ? this.$refs.modal.hide().then(() => {
          this.$emit('hide')
          this.__updateModel(false)
        })
        : Promise.resolve()
    },
    __getActions (h) {
      return this.actions.map(action => h(this.grid ? 'div' : QItem, {
        staticClass: this.grid
          ? 'cursor-pointer relative-position column inline flex-center'
          : null,
        'class': action.classes,
        domProps: { tabindex: '0' },
        on: {
          click: () => this.__onOk(action),
          keydown: (e) => this.__onOk(action)
        }
      }, this.grid
        ? [
          action.icon ? h(QIcon, { props: { name: action.icon } }) : null,
          action.avatar ? h('img', { domProps: { src: action.avatar }, staticClass: 'avatar' }) : null,
          h('span', [ action.label ])
        ]
        : [
          h(QItemSide, { props: { icon: action.icon, avatar: action.avatar } }),
          h(QItemMain, { props: { inset: true, label: action.label } })
        ]
      ))
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
