<template>
  <q-input
    ref="input"
    type="dropdown"
    :disabled="disable"
    :readonly="readonly"
    :placeholder="placeholder"
    :value="actualValue"
    :float-label="floatLabel"
    :stacked-label="stackedLabel"
    :simple="simple"
    :align="align"
    @click="open"
    @focus="$emit('focus')"
    @blur="__blur"
  >
    <q-popover
      v-if="desktop"
      ref="popup"
      :offset="[0, 4]"
      :disable="disable || readonly"
      :anchor-click="false"
    >
      <q-inline-datetime
        ref="target"
        v-model="model"
        :default-selection="defaultSelection"
        :type="type"
        :min="min"
        :max="max"
        :format24h="format24h"
        :monday-first="mondayFirst"
        class="no-border"
      >
        <div class="modal-buttons row full-width">
          <q-btn v-if="!noClear && model" @click="clear()" class="primary clear" v-html="clearLabel"></q-btn>
          <div class="auto"></div>
          <q-btn @click="close()" class="primary clear" v-html="cancelLabel"></q-btn>
          <q-btn @click="close(__update)" class="primary clear" v-html="okLabel"></q-btn>
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
      <q-inline-datetime
        ref="target"
        v-model="model"
        :default-selection="defaultSelection"
        :type="type"
        :min="min"
        :max="max"
        :format24h="format24h"
        :monday-first="mondayFirst"
        class="no-border full-width"
      >
        <div class="modal-buttons row full-width">
          <q-btn v-if="!noClear && model" @click="clear()" class="primary clear" v-html="clearLabel"></q-btn>
          <div class="auto"></div>
          <q-btn @click="close()" class="primary clear" v-html="cancelLabel"></q-btn>
          <q-btn @click="close(__update)" class="primary clear" v-html="okLabel"></q-btn>
        </div>
      </q-inline-datetime>
    </q-modal>
  </q-input>
</template>

<script>
import Platform from '../../features/platform'
import extend from '../../utils/extend'
import { current as theme } from '../../features/theme'
import { input, inline } from './datetime-props'
import { QInput } from '../input'
import { QPopover } from '../popover'
import QInlineDatetime from './QInlineDatetime'
import { QBtn } from '../btn'
import { formatDate } from '../../utils/date'
import { QModal } from '../modal'

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
  name: 'q-datetime',
  components: {
    QInput,
    QPopover,
    QModal,
    QInlineDatetime,
    QBtn
  },
  props: extend({defaultSelection: [String, Number, Date]}, input, inline),
  data () {
    let data = Platform.is.desktop ? {} : {
      css: contentCSS[theme],
      position: theme === 'ios' ? 'items-end justify-center' : 'items-center justify-center',
      transition: theme === 'ios' ? 'q-modal-bottom' : 'q-modal',
      classNames: theme === 'ios' ? '' : 'minimized'
    }
    data.model = this.value
    data.desktop = Platform.is.desktop
    return data
  },
  computed: {
    actualValue () {
      if (!this.value) {
        return ''
      }

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

      return formatDate(this.value, format)
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
      this.$refs.popup.close()
      this.$emit('input', '')
    },
    __blur (e) {
      this.$emit('blur')
      setTimeout(() => {
        if (document.activeElement !== document.body && !this.$refs.popup.$el.contains(document.activeElement)) {
          this.close()
        }
      }, 1)
    },
    __setModel () {
      this.model = this.value
    },
    __update () {
      this.$emit('input', this.model || this.$refs.target.model)
    }
  }
}
</script>
