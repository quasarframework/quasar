<template>
  <q-modal
    class="minimized"
    ref="dialog"
    @close="__dismiss()"
    :no-backdrop-dismiss="noBackdropDismiss"
    :no-esc-dismiss="noEscDismiss"
  >
    <div class="modal-header" v-html="title || ''"></div>
    <div v-if="message" class="modal-body modal-scroll" v-html="message"></div>

    <div v-if="form" class="modal-body modal-scroll">
      <template v-for="el in form">
        <h6 v-if="el.type === 'heading'" v-html="el.label"></h6>

        <q-input
          v-if="__isInputType(el.type)"
          :type="el.type"
          style="margin-bottom: 10px"
          v-model="el.model"
          :placeholder="el.placeholder"
          :float-label="el.label"
        ></q-input>

        <div v-if="el.type === 'chips'" style="margin-bottom: 10px">
          <label v-html="el.label"></label>
          <q-chips v-model="el.model"></q-chips>
        </div>

        <label v-if="el.type === 'radio'" v-for="radio in el.items" :key="radio" class="item" v-ripple.mat>
          <div class="item-primary">
            <q-radio v-model="el.model" :val="radio.value" :disable="radio.disabled"></q-radio>
          </div>
          <div class="item-content" v-html="radio.label"></div>
        </label>

        <label v-if="el.type === 'checkbox'" v-for="checkbox in el.items" :key="checkbox" class="item" v-ripple.mat>
          <div class="item-primary">
            <q-checkbox v-model="checkbox.model" :disable="checkbox.disabled"></q-checkbox>
          </div>
          <div class="item-content" v-html="checkbox.label"></div>
        </label>

        <label v-if="el.type === 'toggle'" v-for="toggle in el.items" :key="toggle" class="item" v-ripple.mat>
          <div class="item-content has-secondary" v-html="toggle.label"></div>
          <div class="item-secondary">
            <q-toggle v-model="toggle.model" :disable="toggle.disabled"></q-toggle>
          </div>
        </label>

        <div v-if="el.type === 'range' || el.type === 'double-range'" style="margin-top: 15px; margin-bottom: 10px">
          <label v-html="el.label + ' (' + (el.type === 'double-range' ? el.model.min + ' to ' + el.model.max : el.model) + ')'"></label>
          <component
            :is="'q-' + el.type"
            v-model="el.model"
            :min="el.min"
            :max="el.max"
            :step="el.step"
            :label="el.withLabel"
            :label-always="el.labelAlways"
            :markers="el.markers"
            :snap="el.snap"
            class="with-padding"
          ></component>
        </div>

        <div v-if="el.type === 'rating'" style="margin-bottom: 10px">
          <label v-html="el.label"></label>
          <q-rating v-model="el.model" :max="el.max" :icon="el.icon" :style="{fontSize: el.size || '2rem'}"></q-rating>
        </div>
      </template>
    </div>
    <div v-if="progress" class="modal-body">
      <q-progress
        :percentage="progress.model"
        color="primary"
        animate
        stripe
        :indeterminate="progress.indeterminate"
      ></q-progress>
      <span v-if="!progress.indeterminate">
        {{progress.model}} %
      </span>
    </div>

    <div
      v-if="buttons"
      class="modal-buttons"
      :class="{row: !stackButtons, column: stackButtons}"
    >
      <q-btn
        v-for="button in buttons"
        :key="button"
        @click="trigger(button.handler, button.preventClose)"
        :class="button.classes"
        :style="button.style"
        :color="button.color"
        :flat="button.flat || !button.raised && !button.push && !button.outline && !button.rounded"
        :push="button.push"
        :rounded="button.rounded"
        :outline="button.outline"
      >
        <span v-html="typeof button === 'string' ? button : button.label"></span>
      </q-btn>
    </div>
    <div class="modal-buttons row" v-if="!buttons && !nobuttons">
      <q-btn flat @click="close()">OK</q-btn>
    </div>
  </q-modal>
</template>

<script>
import inputTypes from '../input/input-types'
import { QModal } from '../modal'
import { QInput } from '../input'
import { QChips } from '../chips'
import { QRadio } from '../radio'
import { QCheckbox } from '../checkbox'
import { QToggle } from '../toggle'
import { QRange, QDoubleRange } from '../range'
import { QRating } from '../rating'
import { QProgress } from '../progress'
import { QBtn } from '../btn'

export default {
  name: 'q-dialog',
  components: {
    QModal,
    QInput,
    QChips,
    QRadio,
    QCheckbox,
    QToggle,
    QRange,
    QDoubleRange,
    QRating,
    QProgress,
    QBtn
  },
  props: {
    title: String,
    message: String,
    form: Object,
    stackButtons: Boolean,
    buttons: Array,
    nobuttons: Boolean,
    progress: Object,
    onDismiss: Function,
    noBackdropDismiss: Boolean,
    noEscDismiss: Boolean
  },
  computed: {
    opened () {
      if (this.$refs.dialog) {
        return this.$refs.dialog.active
      }
    }
  },
  methods: {
    trigger (handler, preventClose) {
      const handlerFn = typeof handler === 'function'
      if (!handlerFn) {
        this.close()
        return
      }

      if (preventClose) {
        handler(this.getFormData(), this.close)
      }
      else {
        this.close(() => { handler(this.getFormData()) })
      }
    },
    getFormData () {
      if (!this.form) {
        return
      }

      let data = {}

      Object.keys(this.form).forEach(name => {
        let el = this.form[name]
        if (['checkbox', 'toggle'].includes(el.type)) {
          data[name] = el.items.filter(item => item.model).map(item => item.value)
        }
        else if (el.type !== 'heading') {
          data[name] = el.model
        }
      })

      return data
    },
    close (fn) {
      if (!this.opened) {
        return
      }
      this.$refs.dialog.close(() => {
        if (typeof fn === 'function') {
          fn()
        }
      })
    },
    __isInputType (type) {
      return inputTypes.includes(type)
    },
    __dismiss () {
      this.$root.$destroy()
      if (typeof this.onDismiss === 'function') {
        this.onDismiss()
      }
    }
  },
  mounted () {
    this.$refs.dialog.open(() => {
      if (!this.$q.platform.is.desktop) {
        return
      }

      const node = this.$refs.dialog.$el.getElementsByTagName(this.form ? 'INPUT' : 'BUTTON')
      if (!node.length) {
        return
      }

      if (this.form) {
        node[0].focus()
      }
      else {
        node[node.length - 1].focus()
      }
    })
    this.$root.quasarClose = this.close
  }
}
</script>
