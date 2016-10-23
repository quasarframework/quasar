<template>
  <div class="quasar-select-container">
    <div
      ref="target"
      class="cursor-pointer textfield caret"
      :class="{disabled: disable}"
    >
      <div v-html="label"></div>
    </div>

    <quasar-popover ref="popover" anchor-ref="target" :disable="disable">
      <div class="quasar-select-popover list highlight">
        <label v-if="type === 'radio'" v-for="radio in options" class="item" @click="close">
          <div class="item-primary">
            <quasar-radio v-model="model" :val="radio.value"></quasar-radio>
          </div>
          <div class="item-content" v-html="radio.label"></div>
        </label>

        <button
          v-if="type === 'checkbox' || type === 'toggle'"
          class="primary clear small full-width"
          @click="$refs.popover.close()"
        >
          Close
        </button>

        <label v-if="type === 'checkbox'" v-for="(checkbox, index) in options" class="item">
          <div class="item-primary">
            <quasar-checkbox v-model="optionsModel[index]"></quasar-checkbox>
          </div>
          <div class="item-content" v-html="checkbox.label"></div>
        </label>

        <label v-if="type === 'toggle'" v-for="(toggle, index) in options" class="item">
          <div class="item-content has-secondary" v-html="toggle.label"></div>
          <div class="item-secondary">
            <quasar-toggle v-model="optionsModel[index]"></quasar-toggle>
          </div>
        </label>
      </div>
    </quasar-popover>
  </div>
</template>

<script>
function getOptionsModel (options, value) {
  return options.map(option => {
    return value.includes(option.value) || false
  }).reduce((o, v, i) => {
    o[i] = v
    return o
  }, {})
}

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
    placeholder: String,
    disable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return this.type !== 'radio' ? {optionsModel: getOptionsModel(this.options, this.value)} : {}
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
    label () {
      return this.placeholder || (this.multiple ? this.__getMultipleLabel() : this.__getSingleLabel())
    },
    multiple () {
      return this.type !== 'radio'
    }
  },
  watch: {
    options: {
      deep: true,
      handler (options) {
        this.optionsModel = getOptionsModel(this.options, this.value)
      }
    },
    optionsModel: {
      deep: true,
      handler (options) {
        if (!this.multiple) {
          return
        }

        let model = []
        Object.keys(options).forEach(index => {
          if (options[index]) {
            model.push(this.options[index].value)
          }
        })
        this.model = model
      }
    }
  },
  methods: {
    __getSingleLabel () {
      let option = this.options.find(option => option.value === this.model)
      return option ? option.label : 'Select'
    },
    __getMultipleLabel () {
      let options = this.options
        .filter(option => this.model.includes(option.value))
        .map(option => option.label)

      if (options.length === 0) {
        return 'Select'
      }
      else if (options.length > 1) {
        return options[0] + ' and ' + (options.length - 1) + ' more'
      }
      return options[0]
    },
    open (event) {
      if (!this.disable) {
        this.$refs.popover.open(event)
      }
    },
    close () {
      this.$refs.popover.close()
    }
  }
}
</script>
