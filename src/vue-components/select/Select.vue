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
    @click="open"
    @focus="$emit('focus')"
    @blur="__blur"
  >
    <q-popover
      ref="popover"
      fit
      :disable="disable || readonly"
      :offset="[0, 4]"
      :anchor-click="false"
    >
      <div class="q-select-popover list highlight">
        <label v-if="type === 'radio'" v-for="radio in options" class="item" @click="close">
          <div class="item-primary">
            <q-radio v-model="model" :val="radio.value"></q-radio>
          </div>
          <div class="item-content">
            <div v-html="radio.label"></div>
          </div>
        </label>

        <div v-if="type === 'list'" class="list no-border highlight" :class="{'item-delimiter': delimiter}" style="min-width: 100px;">
          <q-list-item
            v-for="opt in options"
            :item="opt"
            link
            :active="model === opt.value"
            @click.native="__setAndClose(opt.value)"
          ></q-list-item>
        </div>

        <label v-if="type === 'checkbox'" v-for="(checkbox, index) in options" class="item">
          <div class="item-primary">
            <q-checkbox :value="optModel[index]" @input="toggleValue(checkbox.value)"></q-checkbox>
          </div>
          <div class="item-content">
            <div v-html="checkbox.label"></div>
          </div>
        </label>

        <label v-if="type === 'toggle'" v-for="(toggle, index) in options" class="item">
          <div class="item-content has-secondary">
            <div v-html="toggle.label"></div>
          </div>
          <div class="item-secondary">
            <q-toggle :value="optModel[index]" @input="toggleValue(toggle.value)"></q-toggle>
          </div>
        </label>
      </div>
    </q-popover>
  </q-input>
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
        return !options.some(opt =>
          typeof opt.label === 'undefined' || typeof opt.value === 'undefined'
        )
      }
    },
    type: {
      type: String,
      default: 'list',
      validator (value) {
        return ['radio', 'list', 'checkbox', 'toggle'].includes(value)
      }
    },
    placeholder: String,
    staticLabel: String,
    floatLabel: String,
    stackedLabel: String,
    readonly: Boolean,
    disable: Boolean,
    delimiter: Boolean
  },
  computed: {
    model: {
      get () {
        if (this.multipleSelection && !Array.isArray(this.value)) {
          console.error('Select model needs to be an array when using multiple selection.')
        }
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    optModel () {
      /* Used by multiple selection only */
      if (this.multipleSelection) {
        return this.options.map(opt => this.model.includes(opt.value))
      }
    },
    multipleSelection () {
      return ['checkbox', 'toggle'].includes(this.type)
    },
    actualValue () {
      if (this.staticLabel) {
        return this.staticLabel
      }
      if (!this.multipleSelection) {
        let option = this.options.find(option => option.value === this.model)
        return option ? option.label : ''
      }

      let options = this.options
        .filter(opt => this.model.includes(opt.value))
        .map(opt => opt.label)

      return !options.length ? '' : options.join(', ')
    }
  },
  methods: {
    open (event) {
      if (!this.disable && !this.readonly) {
        this.$refs.popover.open()
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
    },

    __blur (e) {
      this.$emit('blur')
      setTimeout(() => {
        if (document.activeElement !== document.body && !this.$refs.popover.$el.contains(document.activeElement)) {
          this.close()
        }
      }, 1)
    },
    __setAndClose (val) {
      this.model = val
      this.close()
    }
  }
}
</script>
