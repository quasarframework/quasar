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

    @click.native="toggle"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
  >
    <div class="col row items-center q-input-target" :class="alignClass" v-html="actualValue"></div>

    <q-popover
      v-if="usingPopover"
      ref="popup"
      :offset="[0, 10]"
      :disable="disable"
      :anchor-click="false"
      @show="__onFocus"
      @hide="__onHide"
      max-height="100vh"
    >
      <q-inline-datetime
        ref="target"
        v-model="model"
        :default-selection="defaultSelection"
        :type="type"
        :min="min"
        :max="max"
        :format24h="format24h"
        :first-day-of-week="firstDayOfWeek"
        :color="color"
        class="no-border"
      >
        <div class="row q-datetime-controls modal-buttons-top">
          <q-btn :color="color" v-if="!noClear && model" @click="clear" flat :label="clearLabel || $q.i18n.label.clear"></q-btn>
          <div class="col"></div>
          <q-btn :color="color" @click="hide" flat :label="cancelLabel || $q.i18n.label.cancel"></q-btn>
          <q-btn :color="color" @click="hide(), __update()" flat :label="okLabel || $q.i18n.label.ok"></q-btn>
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
      :content-css="contentCSS"
      @show="__onFocus"
      @hide="__onHide"
    >
      <q-inline-datetime
        ref="target"
        v-model="model"
        :default-selection="defaultSelection"
        :type="type"
        :min="min"
        :max="max"
        :format24h="format24h"
        :first-day-of-week="firstDayOfWeek"
        :color="color"
        class="no-border"
        :class="{'full-width': $q.theme === 'ios'}"
      >
        <div class="modal-buttons modal-buttons-top row full-width">
          <q-btn :color="color" v-if="!noClear && model" @click="clear" flat wait-for-ripple :label="clearLabel || $q.i18n.label.clear"></q-btn>
          <div class="col"></div>
          <q-btn :color="color" @click="hide" flat wait-for-ripple :label="cancelLabel || $q.i18n.label.cancel"></q-btn>
          <q-btn :color="color" @click="hide(), __update()" flat wait-for-ripple :label="okLabel || $q.i18n.label.ok"></q-btn>
        </div>
      </q-inline-datetime>
    </q-modal>

    <q-icon slot="after" :name="$q.icon.datetime.dropdown" class="q-if-control"></q-icon>
  </q-input-frame>
</template>

<script>
import FrameMixin from '../../mixins/input-frame'
import extend from '../../utils/extend'
import { input, inline } from './datetime-props'
import { QInputFrame } from '../input-frame'
import { QPopover } from '../popover'
import QInlineDatetime from './QInlineDatetime'
import { QBtn } from '../btn'
import { formatDate, isSameDate } from '../../utils/date'
import { QModal } from '../modal'

let contentCSS = __THEME__ === 'ios'
  ? {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none',
    backgroundColor: '#e4e4e4'
  }
  : {
    maxWidth: '95vw',
    maxHeight: '98vh'
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
  props: extend(
    {
      defaultSelection: [String, Number, Date],
      displayValue: String
    },
    input,
    inline
  ),
  data () {
    let data = this.usingPopover ? {} : {
      contentCSS,
      position: __THEME__ === 'ios' ? 'items-end justify-center' : 'flex-center',
      transition: __THEME__ === 'ios' ? 'q-modal-bottom' : 'q-modal',
      classNames: __THEME__ === 'ios' ? '' : 'minimized'
    }
    data.model = this.value
    data.focused = false
    return data
  },
  computed: {
    usingPopover () {
      return this.$q.platform.is.desktop && !this.$q.platform.within.iframe
    },
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
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

      return formatDate(this.value, format, /* for reactiveness */ this.$q.i18n.date)
    }
  },
  methods: {
    toggle () {
      this[this.$refs.popup.showing ? 'hide' : 'show']()
    },
    show () {
      if (!this.disable) {
        this.__setModel()
        return this.$refs.popup.show()
      }
    },
    hide () {
      this.focused = false
      return this.$refs.popup.hide()
    },
    clear () {
      if (this.value !== '') {
        this.$emit('input', '')
        this.$emit('change', '')
      }
      this.$refs.popup.hide()
    },

    __onFocus () {
      this.focused = true
      this.$emit('focus')
    },
    __onBlur (e) {
      this.__onHide()
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popup.$el.contains(el)) {
          this.hide()
        }
      }, 1)
    },
    __onHide () {
      this.focused = false
      this.$emit('blur')
    },
    __setModel () {
      this.model = this.value
    },
    __update () {
      const val = this.model || this.$refs.target.model
      if (!isSameDate(this.value, val)) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  }
}
</script>
