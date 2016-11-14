<template>
  <quasar-picker-textfield
    :disable="disable"
    :readonly="readonly"
    :label="label"
    :placeholder="placeholder"
    :value="actualValue"
  >
    <quasar-popover ref="popover" :disable="disable || readonly">
      <div class="quasar-select-popover list highlight">
        <label v-if="type === 'radio'" v-for="radio in options" class="item" @click="close">
          <div class="item-primary">
            <quasar-radio v-model="model" :val="radio.value"></quasar-radio>
          </div>
          <div class="item-content" v-html="radio.label"></div>
        </label>

        <label v-if="type === 'checkbox'" v-for="(checkbox, index) in options" class="item">
          <div class="item-primary">
            <quasar-checkbox :value="optModel[index]" @input="toggleValue(checkbox.value)"></quasar-checkbox>
          </div>
          <div class="item-content" v-html="checkbox.label"></div>
        </label>

        <label v-if="type === 'toggle'" v-for="(toggle, index) in options" class="item">
          <div class="item-content has-secondary" v-html="toggle.label"></div>
          <div class="item-secondary">
            <quasar-toggle :value="optModel[index]" @input="toggleValue(toggle.value)"></quasar-toggle>
          </div>
        </label>
      </div>
    </quasar-popover>
  </quasar-picker-textfield>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator (options) {
        return !options.some(option =>
          typeof option.label === 'undefined' || typeof option.value === 'undefined'
        )
      }
    },
    type: {
      type: String,
      required: true,
      validator (value) {
        return ['radio', 'checkbox', 'toggle'].includes(value)
      }
    },
    label: String,
    placeholder: String,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    optModel () {
      /* Used by multiple selection only */
      return this.options.map(opt => this.model.includes(opt.value))
    },
    actualValue () {
      if (this.type === 'radio') {
        let option = this.options.find(option => option.value === this.model)
        return option ? option.label : ''
      }

      let options = this.options
        .filter(option => this.model.includes(option.value))
        .map(option => option.label)

      return !options.length ? '' : options.join(', ')
    }
  },
  methods: {
    open (event) {
      if (!this.disable && !this.readonly) {
        this.$refs.popover.open(event)
      }
    },
    close () {
      this.$refs.popover.close()
    },
    toggleValue (value) {
      let index = this.model.indexOf(value)
      if (index >= 0) {
        this.model.splice(index, 1)
      }
      else {
        this.model.push(value)
      }
    }
  }
}
</script>
