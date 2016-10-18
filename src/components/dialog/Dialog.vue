<template>
  <quasar-modal class="minimized" ref="dialog">
    <div class="modal-header" v-html="title || ''"></div>
    <div v-if="message" class="modal-body modal-scroll" v-html="message"></div>

    <div v-if="form" class="modal-body modal-scroll">
      <template v-for="el in form">
        <h6 v-if="el.type === 'heading'" v-html="el.label"></h6>

        <div v-if="el.type === 'input'" class="floating-label" style="margin-bottom: 10px">
          <input type="text" class="full-width" v-model="el.model" :placeholder="el.placeholder" required>
          <label v-html="el.label"></label>
        </div>

        <label v-if="el.type === 'radio'" v-for="radio in el.items" class="item">
          <div class="item-primary">
            <quasar-radio v-model="el.model" :val="radio.value"></quasar-radio>
          </div>
          <div class="item-content" v-html="radio.label"></div>
        </label>

        <label v-if="el.type === 'checkbox'" v-for="checkbox in el.items" class="item">
          <div class="item-primary">
            <quasar-checkbox v-model="checkbox.model"></quasar-checkbox>
          </div>
          <div class="item-content" v-html="checkbox.label"></div>
        </label>

        <label v-if="el.type === 'toggle'" v-for="toggle in el.items" class="item">
          <div class="item-content has-secondary" v-html="toggle.label"></div>
          <div class="item-secondary">
            <quasar-toggle v-model="toggle.model"></quasar-toggle>
          </div>
        </label>

        <template v-if="el.type === 'progress'">
          <quasar-progress
            :percentage="el.model"
            class="primary stripe animate"
            :class="{indeterminate: el.indeterminate}"
          ></quasar-progress>
          <span v-if="!el.indeterminate">
            {{el.model}} %
          </span>
        </template>
      </template>
    </div>

    <div
      v-if="buttons"
      class="modal-buttons"
      :class="{row: !stackButtons, column: stackButtons}"
    >
      <button
        v-for="button in buttons"
        class="primary clear"
        @click="trigger(button.handler)"
        v-html="typeof button === 'string' ? button : button.label"
      ></button>
    </div>
  </quasar-modal>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
    form: Object,
    stackButtons: Boolean,
    buttons: [Array, Boolean],
    destroy: Boolean
  },
  computed: {
    opened () {
      return this.$refs.dialog.active
    }
  },
  methods: {
    trigger (handler) {
      this.close(() => {
        if (typeof handler === 'function') {
          handler(this.getData())
        }
      })
    },
    getData () {
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
        this.$root.$destroy()
      })
    }
  },
  mounted () {
    this.$refs.dialog.open()
  },
  destroyed () {
    document.body.removeChild(this.$el)
  }
}
</script>
