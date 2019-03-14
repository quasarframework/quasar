import Vue from 'vue'

import QDialog from '../dialog/QDialog.js'

import QIcon from '../icon/QIcon.js'
import QSeparator from '../separator/QSeparator.js'

import QCard from '../card/QCard.js'
import QCardSection from '../card/QCardSection.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

export default Vue.extend({
  name: 'BottomSheetPlugin',

  inheritAttrs: false,

  props: {
    title: String,
    message: String,
    actions: Array,

    grid: Boolean,
    width: String,

    color: {
      type: String,
      default: 'primary'
    }
  },

  methods: {
    show () {
      this.cancelled = true
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onOk (action) {
      this.cancelled = false
      this.$emit('ok', action)
      this.hide()
    },

    __getGrid (h) {
      return this.actions.map(action => {
        return action.label === void 0
          ? h(QSeparator, { staticClass: 'col-12' })
          : h('div', {
            staticClass: 'q-bottom-sheet__item col-4 col-sm-3 q-hoverable q-focusable cursor-pointer relative-position',
            class: action.classes,
            attrs: { tabindex: 0 },
            on: {
              click: () => this.onOk(action),
              keyup: e => {
                e.keyCode === 13 && this.onOk(action)
              }
            }
          }, [
            h('div', { staticClass: 'q-focus-helper' }),

            action.icon
              ? h(QIcon, { props: { name: action.icon, color: action.color } })
              : h('img', {
                attrs: { src: action.avatar || action.img },
                staticClass: action.avatar ? 'q-bottom-sheet__avatar' : null
              }),

            h('div', [ action.label ])
          ])
      })
    },

    __getList (h) {
      return this.actions.map(action => {
        return action.label === void 0
          ? h(QSeparator, { props: { spaced: true } })
          : h(QItem, {
            staticClass: 'q-bottom-sheet__item',
            class: action.classes,
            props: {
              tabindex: 0,
              clickable: true
            },
            on: {
              click: () => this.onOk(action),
              keyup: e => {
                e.keyCode === 13 && this.onOk(action)
              }
            }
          }, [
            h(QItemSection, { props: { avatar: true } }, [
              action.icon
                ? h(QIcon, { props: { name: action.icon, color: action.color } })
                : h('img', {
                  attrs: { src: action.avatar || action.img },
                  staticClass: action.avatar ? 'q-bottom-sheet__avatar' : null
                })
            ]),
            h(QItemSection, [ action.label ])
          ])
      })
    }
  },

  render (h) {
    let child = []

    if (this.title) {
      child.push(
        h(QCardSection, {
          staticClass: 'q-dialog__title'
        }, [ this.title ])
      )
    }

    if (this.message) {
      child.push(
        h(QCardSection, {
          staticClass: 'q-dialog__message scroll'
        }, [ this.message ])
      )
    }

    child.push(
      this.grid === true
        ? h('div', {
          staticClass: 'scroll row items-stretch justify-start'
        }, this.__getGrid(h))
        : h('div', { staticClass: 'scroll' }, this.__getList(h))
    )

    return h(QDialog, {
      ref: 'dialog',

      props: {
        ...this.$attrs,
        position: 'bottom'
      },

      on: {
        hide: () => {
          this.cancelled === true && this.$emit('cancel')
          this.$emit('hide')
        }
      }
    }, [
      h(QCard, {
        staticClass: `q-bottom-sheet q-bottom-sheet--${this.grid ? 'grid' : 'list'}`,
        style: { width: this.width }
      }, child)
    ])
  }
})
