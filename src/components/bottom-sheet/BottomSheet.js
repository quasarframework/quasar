import Vue from 'vue'

import QDialog from '../dialog/QDialog.js'

import QCard from '../card/QCard.js'
import QCardSection from '../card/QCardSection.js'

import QIcon from '../icon/QIcon.js'
import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'
import QSeparator from '../separator/QSeparator.js'

export default Vue.extend({
  name: 'BottomSheetPlugin',

  props: {
    title: String,
    message: String,
    grid: Boolean,
    actions: Array,

    width: {
      type: String,
      default: '400px'
    },

    color: {
      type: String,
      default: 'primary'
    },

    // QDialog props -- avoid duplicating the validations
    maximized: {},
    persistent: {},
    seamless: {},
    noEscKey: {},
    fullWidth: {},
    fullHeight: {}
  },

  computed: {
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onOk () {
      this.$emit('ok')
      this.hide()
    },

    onCancel () {
      this.$emit('cancel')
      this.hide()
    },

    __getActions (h) {
      return this.actions.map(action => action.label
        ? h(this.grid ? 'div' : QItem, {
          staticClass: this.grid
            ? 'q-actionsheet-grid-item cursor-pointer relative-position column inline flex-center'
            : null,
          'class': action.classes,
          props: {
            tabindex: 0,
            clickable: true
          },
          [this.grid ? 'on' : 'nativeOn']: {
            click: () => this.onOk(action),
            keyup: e => {
              if (e.keyCode === /* Enter */ 13) {
                this.onOk(action)
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
            h(QItemSection, { props: { avatar: true } }, [
              action.icon ? h(QIcon, { props: { name: action.icon, color: action.color } }) : null,
              action.avatar ? h('img', { domProps: { src: action.avatar }, staticClass: 'avatar' }) : null
            ]),
            h(QItemSection, [ action.label ])
          ]
        )
        : h(QSeparator, { staticClass: 'col-12', props: { spaced: true } })
      )
    }
  },

  render (h) {
    const child = []

    if (this.title) {
      child.push(
        h(QCardSection, {
          staticClass: 'text-h6'
        }, [ this.title ])
      )
    }

    if (this.message) {
      child.push(
        h(QCardSection, {
          staticClass: 'text-grey-8 scroll'
        }, [ this.message ])
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
              : h('div', this.__getActions(h))
          ]
          : this.$slots.default
      )
    )

    return h(QDialog, {
      ref: 'dialog',

      props: {
        value: this.value,
        maximized: this.maximized,
        persistent: false, // this.persistent,
        noEscKey: this.noEscKey,
        position: 'bottom'
      },

      on: {
        hide: () => {
          this.$emit('hide')
        }
      }
    }, [
      h(QCard, {
        style: 'width: ' + this.width
      }, child)
    ])
  }
})
