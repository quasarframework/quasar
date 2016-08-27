<template>
  <quasar-popover v-ref:popover>
    <span slot="target">
      <button :class="classes" @click="__parseOptions">
        {{{ label }}} &#8675
      </button>
    </span>

    <div class="list item-delimiter highlight">
      <label v-if="type === 'radio'" v-for="radio in options" class="item" @click="close">
        <quasar-radio :model.sync="model" :value.once="radio.value"></quasar-radio>
        <div class="item-content">
          {{{* radio.label}}}
        </div>
      </label>

      <label v-if="type === 'checkbox'" v-for="checkbox in options" class="item">
        <quasar-checkbox :model.sync="multipleOptions[$index]"></quasar-checkbox>
        <div class="item-content">
          {{{* checkbox.label}}}
        </div>
      </label>

      <label v-if="type === 'toggle'" v-for="toggle in options" class="item">
        <div class="item-content">
          <div class="item-label">
            {{{* toggle.label}}}
          </div>
          <quasar-toggle :model.sync="multipleOptions[$index]"></quasar-toggle>
        </div>
      </label>
    </div>
  </quasar-popover>
</template>

<script>
export default {
  data () {
    return {
      multipleOptions: [],
      skipModelUpdate: false
    }
  },
  props: {
    model: {
      twoWay: true
    },
    options: {
      type: Array,
      required: true,
      validator: options => {
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
    classes: {
      type: Array,
      default () {
        return ['primary', 'clear']
      },
      coerce (value) {
        if (typeof value === 'string') {
          console.log(value.split(' '))
          return value.split(' ')
        }
        return value
      }
    },
    fixedLabel: String
  },
  computed: {
    label () {
      return this.fixedLabel || this.type === 'radio' ? this.__getSingleLabel() : this.__getMultipleLabel()
    },
    multiple () {
      return this.type !== 'radio'
    }
  },
  watch: {
    multipleOptions: {
      deep: true,
      handler (options) {
        if (!this.multiple || this.skipModelUpdate) {
          this.skipModelUpdate = false
          return
        }

        let index = 0
        let model = []

        options.forEach(option => {
          if (option) {
            model.push(this.options[index].value)
          }
          index++
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
        return options[0] + ', ...'
      }
      return options[0]
    },
    __parseOptions () {
      if (!Array.isArray(this.options)) {
        throw new Error('Select options parameter must be an array.')
      }
      if (this.options.some(
        option => typeof option.label === 'undefined' || typeof option.value === 'undefined'
      )) {
        throw new Error('One of Select\'s option is missing either label or value')
      }

      if (this.multiple) {
        this.skipModelUpdate = true
        this.multipleOptions = this.options.map(option => {
          return this.model.includes(option.value) || false
        })
      }
    },
    open (event) {
      this.parseOptions()
      this.$refs.popover.open(event)
    },
    close (event) {
      this.$refs.popover.close(event)
    }
  }
}
</script>
