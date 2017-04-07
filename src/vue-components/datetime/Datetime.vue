<template>
  <q-picker-textfield
    :disable="disable"
    :readonly="readonly"
    :label="label"
    :placeholder="placeholder"
    :static-label="staticLabel"
    :value="actualValue"
    @click.native="__open"
    @keydown.native.enter="open"
  >
    <q-popover
      v-if="desktop"
      ref="popup"
      @open="__setModel()"
      :disable="disable || readonly"
    >
      <q-inline-datetime v-model="model" :type="type" :min="minTime" :max="maxTime" class="no-border">
        <div class="modal-buttons row full-width">
          <button v-if="!noClear" @click="clear()" class="primary clear" v-html="clearLabel"></button>
          <div class="auto"></div>
          <button @click="close()" class="primary clear" v-html="cancelLabel"></button>
          <button @click="close(__update)" class="primary clear" v-html="okLabel"></button>
        </div>
      </q-inline-datetime>
    </q-popover>

    <q-modal
      v-else
      ref="popup"
      class="with-backdrop"
      :class="classNames"
      :transition="transition"
      :position-classes="position"
      :content-css="css"
    >
      <q-inline-datetime v-model="model" :type="type" :min="minTime" :max="maxTime" class="no-border full-width">
        <div class="modal-buttons row full-width">
          <button v-if="!noClear" @click="clear()" class="primary clear" v-html="clearLabel"></button>
          <div class="auto"></div>
          <button @click="close()" class="primary clear" v-html="cancelLabel"></button>
          <button @click="close(__update)" class="primary clear" v-html="okLabel"></button>
        </div>
      </q-inline-datetime>
    </q-modal>
  </q-picker-textfield>
</template>

<script>
import moment from 'moment'
import Platform from '../../features/platform'
import { current as theme } from '../../features/theme'
import extend from '../../utils/extend'
import { input as props } from './datetime-props'

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
  props: extend(
    {
      value: {
        type: [String, Number, Date],
        required: true
      }
    },
    props,
    {
      min: {
        type: [String, Number, Date],
        default: ''
      },
      max: {
        type: [String, Number, Date],
        default: ''
      }
    }
  ),
  data () {
    let data = Platform.is.desktop ? {} : {
      css: contentCSS[theme],
      position: theme === 'ios' ? 'items-end justify-center' : 'items-center justify-center',
      transition: theme === 'ios' ? 'q-modal-bottom' : 'q-modal',
      classNames: theme === 'ios' ? '' : 'minimized'
    }
    data.model = this.__valueToString(this.value)
    data.desktop = Platform.is.desktop
    return data
  },
  computed: {
    actualValue () {
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

      return this.value ? moment(this.value).format(format) : ''
    },
    minTime () {
      return this.__valueToString(this.min)
    },
    maxTime () {
      return this.__valueToString(this.max)
    }
  },
  watch: {
    min () {
      this.__normalizeAndEmit()
    },
    max () {
      this.__normalizeAndEmit()
    }
  },
  methods: {
    open () {
      if (!this.disable && !this.readonly) {
        this.__setModel()
        this.$refs.popup.open()
      }
    },
    close (fn) {
      this.$refs.popup.close(fn)
    },
    clear () {
      const type = typeof this.value
      let value
      this.$refs.popup.close()
      if (type === 'number') {
        value = 0
      }
      else if (type === 'object') {
        value = null
      }
      else {
        value = ''
      }
      this.$emit('input', value)
    },
    __open () {
      if (!this.desktop) {
        this.open()
      }
    },
    __normalizeValue (value) {
      if (this.min) {
        value = moment.max(moment(this.min).clone(), value)
      }
      if (this.max) {
        value = moment.min(moment(this.max).clone(), value)
      }
      return value
    },
    __valueToString (value) {
      return typeof value === 'string' || value == null
                ? (value || '')
                : moment(value).format()
    },
    __setModel () {
      const value = this.value
      this.model = value || value === 0
                    ? this.__valueToString(value)
                    : this.__normalizeValue(moment(this.defaultSelection)).format()
    },
    __valueToData (value) {
      let data = typeof value === 'string'
                          ? moment(value)
                          : value
      const type = typeof this.value
      if (type === 'number') {
        data = data.valueOf()
      }
      else if (type === 'object') {
        data = data.toDate()
      }
      else {
        data = data.format()
      }
      return data
    },
    __update () {
      this.$emit('input', this.__valueToData(this.model))
    },
    __normalizeAndEmit () {
      this.$nextTick(() => {
        const value = this.value
        if (value) {
          this.$emit('input', this.__valueToData(this.__normalizeValue(moment(value))))
        }
      })
    }
  }
}
</script>
