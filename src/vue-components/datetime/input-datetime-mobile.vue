<template>
  <div class="cursor-pointer textfield" @click="pick" :class="{disabled: disable}">
    <span v-html="label"></span>
    <div class="float-right quasar-select-arrow caret-down"></div>
  </div>
</template>

<script>
import moment from 'moment'
import Modal from '../../components/modal/modal'
import PickerModal from './datetime-modal.vue'
import { current as theme } from '../../theme'

export default {
  props: {
    type: {
      type: String,
      default: 'date',
      twoWay: true
    },
    model: {
      type: String,
      required: true
    },
    format: {
      type: String
    },
    okLabel: {
      type: String,
      default: 'Set'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  computed: {
    label () {
      let format

      if (this.format) {
        format = this.format
      }
      else if (this.type === 'date') {
        format = 'YYYY/MM/DD'
      }
      else if (this.type === 'time') {
        format = 'HH:mm'
      }
      else {
        format = 'YYYY/MM/DD HH:mm:ss'
      }

      return moment(this.model).format(format)
    }
  },
  methods: {
    pick () {
      if (this.disable) {
        return
      }

      let modal

      PickerModal.data = {
        model: this.model,
        type: this.type,
        okLabel: this.okLabel,
        cancelLabel: this.cancelLabel
      }
      PickerModal.methods.set = model => {
        this.model = model
        modal.close()
      }

      modal = Modal.create(PickerModal)

      if (theme === 'ios') {
        modal.$el.classList.remove('items-center')
        modal.$el.classList.add('items-end')
        modal.css({
          maxHeight: '80vh',
          height: 'auto',
          boxShadow: 'none',
          backgroundColor: '#e4e4e4'
        })
        .set({
          transitionIn: {translateY: [0, '101%']},
          transitionOut: {translateY: ['101%', 0]},
          closeWithBackdrop: true
        }).show()
      }
      else {
        modal.set({
          minimized: true,
          closeWithBackdrop: true
        })
        .css({
          maxWidth: '95vw',
          maxHeight: '98vh'
        })
        .show()
      }
    }
  }
}
</script>
