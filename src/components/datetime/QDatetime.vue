<template>
  <q-input-frame
    class="q-datetime-input"

    :prefix="prefix"
    :suffix="suffix"
    :stack-label="stackLabel"
    :float-label="floatLabel"
    :error="error"
    :disable="disable"
    :inverted="inverted"
    :dark="dark"
    :before="before"
    :after="after"
    :color="color"

    :focused="focused"
    focusable
    :length="actualValue.length"

    @click.native="open"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
  >
    <div class="col-grow row items-center q-input-target" :class="[`text-${align}`]">{{ actualValue }}</div>

    <q-popover
      v-if="$q.platform.is.desktop"
      ref="popup"
      :offset="[0, 10]"
      :disable="disable"
      :anchor-click="false"
      @open="__onFocus"
      @close="__onClose"
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
        :color="color"
        class="no-border"
      >
        <div class="row q-datetime-controls modal-buttons-top">
          <q-btn :color="color" v-if="!noClear && model" @click="clear()" flat>
            <span v-html="clearLabel"></span>
          </q-btn>
          <div class="col"></div>
          <q-btn :color="color" @click="close()" flat><span v-html="cancelLabel"></span></q-btn>
          <q-btn :color="color" @click="close(__update)" flat><span v-html="okLabel"></span></q-btn>
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
      @open="__onFocus"
      @close="__onClose"
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
        :color="color"
        class="no-border"
        :class="{'full-width': $q.theme === 'ios'}"
      >
        <div class="modal-buttons modal-buttons-top row full-width">
          <q-btn :color="color" v-if="!noClear && model" @click="clear()" flat>
            <span v-html="clearLabel"></span>
          </q-btn>
          <div class="col"></div>
          <q-btn :color="color" @click="close()" flat><span v-html="cancelLabel"></span></q-btn>
          <q-btn :color="color" @click="close(__update)" flat><span v-html="okLabel"></span></q-btn>
        </div>
      </q-inline-datetime>
    </q-modal>

    <q-icon slot="control" name="arrow_drop_down" class="q-if-control"></q-icon>
  </q-input-frame>
</template>

<script>
import FrameMixin from '../input-frame/input-frame-mixin'
import extend from '../../utils/extend'
import { current as theme } from '../../features/theme'
import { input, inline } from './datetime-props'
import { QInputFrame } from '../input-frame'
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
  mixins: [FrameMixin],
  components: {
    QInputFrame,
    QPopover,
    QModal,
    QInlineDatetime,
    QBtn
  },
  props: extend({defaultSelection: [String, Number, Date]}, input, inline),
  data () {
    let data = this.$q.platform.is.desktop ? {} : {
      css: contentCSS[theme],
      position: theme === 'ios' ? 'items-end justify-center' : 'items-center justify-center',
      transition: theme === 'ios' ? 'q-modal-bottom' : 'q-modal',
      classNames: theme === 'ios' ? '' : 'minimized'
    }
    data.model = this.value
    data.focused = false
    return data
  },
  computed: {
    actualValue () {
      if (!this.value) {
        return this.placeholder || ''
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
      if (!this.disable) {
        this.__setModel()
        this.$refs.popup.open()
      }
    },
    close (fn) {
      this.focused = false
      this.$refs.popup.close(fn)
    },
    clear () {
      this.$refs.popup.close()
      this.$emit('input', '')
    },

    __onFocus () {
      this.focused = true
      this.$emit('focus')
    },
    __onBlur (e) {
      this.__onClose()
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popup.$el.contains(el)) {
          this.close()
        }
      }, 1)
    },
    __onClose () {
      this.focused = false
      this.$emit('blur')
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
