import { h, ref, getCurrentInstance } from 'vue'

import QDialog from '../dialog/QDialog.js'

import QIcon from '../icon/QIcon.js'
import QSeparator from '../separator/QSeparator.js'

import QCard from '../card/QCard.js'
import QCardSection from '../card/QCardSection.js'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'

import { createComponent } from '../../utils/private/create.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

export default createComponent({
  name: 'BottomSheetPlugin',

  props: {
    ...useDarkProps,

    title: String,
    message: String,
    actions: Array,

    grid: Boolean,

    cardClass: [ String, Array, Object ],
    cardStyle: [ String, Array, Object ]
  },

  emits: [ 'ok', 'hide' ],

  setup (props, { emit }) {
    const { proxy } = getCurrentInstance()
    const isDark = useDark(props, proxy.$q)

    const dialogRef = ref(null)

    function show () {
      dialogRef.value.show()
    }

    function hide () {
      dialogRef.value.hide()
    }

    function onOk (action) {
      emit('ok', action)
      hide()
    }

    function onHide () {
      emit('hide')
    }

    function getGrid () {
      return props.actions.map(action => {
        const img = action.avatar || action.img

        return action.label === void 0
          ? h(QSeparator, {
              class: 'col-all',
              dark: isDark.value
            })
          : h('div', {
            class: [
              'q-bottom-sheet__item q-hoverable q-focusable cursor-pointer relative-position',
              action.class
            ],
            tabindex: 0,
            onClick () { onOk(action) },
            onKeyup (e) { e.keyCode === 13 && onOk(action) }
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
    }

    function getList () {
      return props.actions.map(action => {
        const img = action.avatar || action.img

        return action.label === void 0
          ? h(QSeparator, { spaced: true, dark: isDark.value })
          : h(QItem, {
            class: [ 'q-bottom-sheet__item', action.classes ],
            tabindex: 0,
            clickable: true,
            dark: isDark.value,
            onClick () { onOk(action) },
            onKeyup (e) { e.keyCode === 13 && onOk(action) }
          }, () => [
            h(
              QItemSection,
              { avatar: true },
              () => (
                action.icon
                  ? h(QIcon, { name: action.icon, color: action.color })
                  : (
                      img
                        ? h('img', {
                            class: action.avatar ? 'q-bottom-sheet__avatar' : '',
                            src: img
                          })
                        : null
                    )
              )
            ),

            h(QItemSection, () => action.label)
          ])
      })
    }

    function getCardContent () {
      const child = []

      props.title && child.push(
        h(QCardSection, {
          class: 'q-dialog__title'
        }, () => props.title)
      )

      props.message && child.push(
        h(QCardSection, {
          class: 'q-dialog__message'
        }, () => props.message)
      )

      child.push(
        props.grid === true
          ? h('div', {
              class: 'row items-stretch justify-start'
            }, getGrid())
          : h('div', getList())
      )

      return child
    }

    function getContent () {
      return [
        h(QCard, {
          class: [
            `q-bottom-sheet q-bottom-sheet--${ props.grid === true ? 'grid' : 'list' }`
            + (isDark.value === true ? ' q-bottom-sheet--dark q-dark' : ''),
            props.cardClass
          ],
          style: props.cardStyle
        }, getCardContent)
      ]
    }

    // expose public methods
    Object.assign(proxy, { show, hide })

    return () => h(QDialog, {
      ref: dialogRef,
      position: 'bottom',
      onHide
    }, getContent)
  }
})
