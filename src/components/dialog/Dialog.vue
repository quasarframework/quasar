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

        <div v-if="el.type === 'textbox'" class="floating-label" style="margin-bottom: 10px">
          <input type="text" class="full-width" v-model="el.model" :placeholder="el.placeholder" required tabindex="0">
          <label v-html="el.label"></label>
        </div>

        <div v-if="el.type === 'password'" class="floating-label" style="margin-bottom: 10px">
          <input type="password" class="full-width" v-model="el.model" :placeholder="el.placeholder" required tabindex="0">
          <label v-html="el.label"></label>
        </div>

        <div v-if="el.type === 'textarea'" class="floating-label" style="margin-bottom: 10px">
          <textarea type="text" class="full-width" v-model="el.model" :placeholder="el.placeholder" required tabindex="0"></textarea>
          <label v-html="el.label"></label>
        </div>

        <div v-if="el.type === 'numeric'" style="margin-bottom: 10px">
          <label v-html="el.label"></label>
          <q-numeric v-model="el.model" :min="el.min" :max="el.max" :step="el.step" tabindex="0"></q-numeric>
        </div>

        <div v-if="el.type === 'chips'" style="margin-bottom: 10px">
          <label v-html="el.label"></label>
          <q-chips v-model="el.model"></q-chips>
        </div>

        <label v-if="el.type === 'radio'" v-for="radio in el.items" class="item">
          <div class="item-primary">
            <q-radio v-model="el.model" :val="radio.value"></q-radio>
          </div>
          <div class="item-content" v-html="radio.label"></div>
        </label>

        <label v-if="el.type === 'checkbox'" v-for="checkbox in el.items" class="item">
          <div class="item-primary">
            <q-checkbox v-model="checkbox.model"></q-checkbox>
          </div>
          <div class="item-content" v-html="checkbox.label"></div>
        </label>

        <label v-if="el.type === 'toggle'" v-for="toggle in el.items" class="item">
          <div class="item-content has-secondary" v-html="toggle.label"></div>
          <div class="item-secondary">
            <q-toggle v-model="toggle.model"></q-toggle>
          </div>
        </label>

        <!--
        <div v-if="el.type === 'range' || el.type === 'double-range'" style="margin-top: 15px; margin-bottom: 10px">
          <label v-html="el.label + ' (' + (el.type === 'double-range' ? el.model.min + ' to ' + el.model.max : el.model) + ')'"></label>
          <component
            :is="'q-' + el.type"
            v-model="el.model"
            :min="el.min"
            :max="el.max"
            :step="el.step"
            :label="el.withLabel"
            :markers="el.markers"
            :snap="el.snap"
          ></component>
        </div>
        -->

        <div v-if="el.type === 'rating'" style="margin-bottom: 10px">
          <label v-html="el.label"></label>
          <q-rating v-model="el.model" :max="el.max" :icon="el.icon" :style="{fontSize: el.size || '2rem'}"></q-rating>
        </div>
      </template>
    </div>
    <div v-if="progress" class="modal-body">
      <q-progress
        :percentage="progress.model"
        class="primary stripe animate"
        :class="{indeterminate: progress.indeterminate}"
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
      <button
        v-for="button in buttons"
        @click="trigger(button.handler, button.preventClose)"
        :class="button.classes || 'primary clear'"
        :style="button.style"
        v-html="typeof button === 'string' ? button : button.label"
        tabindex="0"
      ></button>
    </div>
    <div class="modal-buttons row" v-if="!buttons && !nobuttons">
      <button class="primary clear" @click="close()" tabindex="0">OK</button>
    </div>
  </q-modal>
</template>

<script>
export default {
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
