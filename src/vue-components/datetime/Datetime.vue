<template>
  <div
    v-if="desktop"
    class="quasar-datetime-desktop cursor-pointer textfield caret"
    :class="{disabled: disable, readonly: readonly}"
  >
    <div v-html="label"></div>

    <quasar-popover ref="popup" @open="__setModel()" :disable="disable || readonly">
      <quasar-inline-datetime v-model="model" :type="type">
        <div class="modal-buttons row full-width">
          <button @click="clear()" class="primary clear" v-html="clearLabel"></button>
          <div class="auto"></div>
          <button @click="close()" class="primary clear" v-html="cancelLabel"></button>
          <button @click="close(__update)" class="primary clear" v-html="okLabel"></button>
        </div>
      </quasar-inline-datetime>
    </quasar-popover>
  </div>

  <div
    v-else
    class="cursor-pointer textfield caret"
    @click="open"
    :class="{disabled: disable, readonly: readonly}"
  >
    <div v-html="label"></div>
    <quasar-modal
      ref="popup"
      class="with-backdrop"
      :class="classNames"
      :transition="transition"
      :position-classes="position"
      :content-css="css"
    >
      <quasar-inline-datetime v-model="model" :type="type" class="no-border" style="width: 100%">
        <div class="modal-buttons row full-width">
          <button @click="clear()" class="primary clear" v-html="clearLabel"></button>
          <div class="auto"></div>
          <button @click="close()" class="primary clear" v-html="cancelLabel"></button>
          <button @click="close(__update)" class="primary clear" v-html="okLabel"></button>
        </div>
      </quasar-inline-datetime>
    </quasar-modal>
  </div>
</template>

<script>
import moment from 'moment'
import Platform from '../../platform'
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
    clearLabel: {
      type: String,
      default: 'Clear'
    },
    okLabel: {
      type: String,
      default: 'Set'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    let data = Platform.is.desktop ? {} : {
      css: contentCSS[theme],
      position: theme === 'ios' ? 'items-end justify-center' : 'items-center justify-center',
      transition: theme === 'ios' ? 'quasar-modal-actions' : 'quasar-modal',
      classNames: theme === 'ios' ? '' : 'minimized'
    }
    data.model = ''
    data.desktop = Platform.is.desktop
    return data
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

      return this.value ? moment(this.value || undefined).format(format) : '&nbsp;'
    }
  },
  methods: {
    open () {
      if (!this.disabled && !this.readonly) {
        this.__setModel()
        this.$refs.popup.open()
      }
    },
    close (fn) {
      this.$refs.popup.close(fn)
    },
    clear () {
      this.$refs.popup.close()
      this.$emit('input', '')
    },
    __setModel () {
      this.model = this.value || moment().format()
    },
    __update () {
      this.$emit('input', this.model)
    }
  }
}
</script>
