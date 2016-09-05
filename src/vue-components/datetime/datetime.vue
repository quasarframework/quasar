<template>
  <div class="cursor-pointer textfield" @click="pick" :class="{disabled: disabled}">
    <span>{{{ label }}}</span>
    <span class="float-right quasar-select-arrow">&#8675</span>
  </div>
</template>

<script>
import moment from 'moment'
import Modal from '../../components/modal/modal'
import PickerModal from './datetime-modal.vue'

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
    disabled: {
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
        format = 'YYYY-MM-DD'
      }
      else if (this.type === 'time') {
        format = 'HH:mm'
      }
      else {
        format = 'YYYY-MM-DD HH:mm:ss'
      }

      return moment(this.model).format(format)
    }
  },
  methods: {
    pick () {
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
        .set({
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
</script>
