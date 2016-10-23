<template>
  <div class="cursor-pointer textfield caret" @click="open" :class="{disabled: disable}">
    <div v-html="label"></div>
    <quasar-modal
      ref="dialog"
      class="with-backdrop"
      :class="classNames"
      :transition="transition"
      :position-classes="position"
      :content-css="css"
    >
      <quasar-inline-datetime v-model="model" :type="type" class="no-border" style="width: 100%">
        <div class="modal-buttons row full-width">
          <button @click="close()" class="primary clear" v-html="cancelLabel"></button>
          <button @click="close(__update)" class="primary clear" v-html="okLabel"></button>
        </div>
      </quasar-inline-datetime>
    </quasar-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { current as theme } from '../../theme'

let contentCSS = {
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none',
    backgroundColor: '#e4e4e4'
  },
  mat: {
    maxWidth: '95vw',
    maxHeight: '98vh'
  }
}

export default {
  props: {
    type: {
      type: String,
      default: 'date'
    },
    value: {
      type: String,
      required: true
    },
    format: String,
    okLabel: {
      type: String,
      default: 'Set'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    disable: Boolean
  },
  data () {
    return {
      model: '',
      css: contentCSS[theme],
      position: theme === 'ios' ? 'items-end justify-center' : 'items-center justify-center',
      transition: theme === 'ios' ? 'quasar-modal-actions' : 'quasar-modal',
      classNames: theme === 'ios' ? '' : 'minimized'
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

      return moment(this.value).format(format)
    }
  },
  methods: {
    open () {
      if (!this.disable) {
        this.model = this.value
        this.$refs.dialog.open()
      }
    },
    close (fn) {
      this.$refs.dialog.close(fn)
    },
    __update () {
      this.$emit('input', this.model)
    }
  }
}
</script>
