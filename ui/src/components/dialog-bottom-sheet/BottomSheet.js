import { h, defineComponent } from 'vue'

import QDialog from '../dialog/QDialog.js'

import QIcon from '../icon/QIcon.js'
import QSeparator from '../separator/QSeparator.js'

import QCard from '../card/QCard.js'
import QCardSection from '../card/QCardSection.js'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'

import DarkMixin from '../../mixins/dark.js'

export default defineComponent({
  name: 'BottomSheetPlugin',

  mixins: [ DarkMixin ],

  inheritAttrs: false,

  props: {
    title: String,
    message: String,
    actions: Array,

    grid: Boolean,

    cardClass: [ String, Array, Object ],
    cardStyle: [ String, Array, Object ]
  },

  emits: [ 'ok', 'hide' ],

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onOk (action) {
      this.$emit('ok', action)
      this.hide()
    },

    onHide () {
      this.$emit('hide')
    },

    __getGrid () {
      return this.actions.map(action => {
        const img = action.avatar || action.img

        return action.label === void 0
          ? h(QSeparator, {
            class: 'col-all',
            dark: this.isDark
          })
          : h('div', {
            class: [
              'q-bottom-sheet__item q-hoverable q-focusable cursor-pointer relative-position',
              action.class
            ],
            tabindex: 0,
            onClick: () => this.onOk(action),
            onKeyup: e => {
              e.keyCode === 13 && this.onOk(action)
            }
          }, [
            h('div', { class: 'q-focus-helper' }),

            action.icon
              ? h(QIcon, { name: action.icon, color: action.color })
              : (
                img
                  ? h('img', {
                    class: action.avatar ? 'q-bottom-sheet__avatar' : '',
                    src: img
                  })
                  : h('div', { class: 'q-bottom-sheet__empty-icon' })
              ),

            h('div', action.label)
          ])
      })
    },

    __getList () {
      return this.actions.map(action => {
        const img = action.avatar || action.img

        return action.label === void 0
          ? h(QSeparator, { spaced: true, dark: this.isDark })
          : h(QItem, {
            class: [ 'q-bottom-sheet__item', action.classes ],
            tabindex: 0,
            clickable: true,
            dark: this.isDark,
            onClick: () => this.onOk(action),
            onKeyup: e => {
              e.keyCode === 13 && this.onOk(action)
            }
          }, () => [
            h(
              QItemSection,
              { avatar: true },
              () => action.icon
                ? h(QIcon, { name: action.icon, color: action.color })
                : (
                  img
                    ? h('img', {
                      class: action.avatar ? 'q-bottom-sheet__avatar' : '',
                      src: img
                    })
                    : null
                )
            ),

            h(QItemSection, () => action.label)
          ])
      })
    },

    __getCardContent () {
      const child = []

      this.title && child.push(
        h(QCardSection, {
          class: 'q-dialog__title'
        }, () => this.title)
      )

      this.message && child.push(
        h(QCardSection, {
          class: 'q-dialog__message'
        }, () => this.message)
      )

      child.push(
        this.grid === true
          ? h('div', {
            class: 'row items-stretch justify-start'
          }, this.__getGrid())
          : h('div', this.__getList())
      )

      return child
    },

    __getContent () {
      return [
        h(QCard, {
          class: [
            `q-bottom-sheet q-bottom-sheet--${this.grid === true ? 'grid' : 'list'}` +
            (this.isDark === true ? ' q-bottom-sheet--dark q-dark' : ''),
            this.cardClass
          ],
          style: this.cardStyle
        }, this.__getCardContent)
      ]
    }
  },

  render () {
    return h(QDialog, {
      ref: 'dialog',
      ...this.$attrs,
      position: 'bottom',
      onHide: this.onHide
    }, this.__getContent)
  }
})
