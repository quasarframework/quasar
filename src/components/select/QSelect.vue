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
      ref="popover"
      fit
      :disable="disable || readonly"
      :offset="[0, 4]"
      :anchor-click="false"
      @close="__resetFilter"
    >
      <q-search
        v-if="filter"
        v-model="terms"
        :placeholder="filterPlaceholder"
        :debounce="50"
      ></q-search>

      <div
        class="list link no-border"
        :class="{delimiter: delimiter}"
      >

        <template v-if="multiple">
          <q-item
            class="item"
            v-for="opt in visibleOptions"
            :key="opt"
            :cfg="opt"
            :active="!checkbox && !toggle && optModel[opt.index]"
            @click.native="__toggle(opt.value)"
          >
            <q-checkbox
              v-if="checkbox"
              slot="primary"
              :value="optModel[opt.index]"
              @click.native="__toggle(opt.value)"
            ></q-checkbox>

            <q-toggle
              v-if="toggle"
              slot="secondary"
              :value="optModel[opt.index]"
              @click.native="__toggle(opt.value)"
            ></q-toggle>
          </q-item>
        </template>
        <template v-else>
          <q-item
            class="item"
            v-for="opt in visibleOptions"
            :key="opt"
            :cfg="opt"
            :active="model === opt.value"
            @click.native="__select(opt.value)"
          >
            <q-radio v-if="radio" slot="primary" :value="model" :val="opt.value"></q-radio>
          </q-item>
        </template>
      </div>
    </q-popover>
  </q-input>
</template>

<script>
import { QInput } from '../input'
import { QSearch } from '../search'
import { QPopover } from '../popover'
import { QItem } from '../item'
import { QCheckbox } from '../checkbox'
import { QRadio } from '../radio'
import { QToggle } from '../toggle'
import clone from '../../utils/clone'

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().startsWith(terms)
}

export default {
  name: 'q-select',
  components: {
    QInput,
    QSearch,
    QPopover,
    QItem,
    QCheckbox,
    QRadio,
    QToggle
  },
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: v => v.every(o => 'label' in o && 'value' in o)
    },
    multiple: Boolean,
    radio: Boolean,
    checkbox: Boolean,
    toggle: Boolean,
    filter: [Function, Boolean],
    filterPlaceholder: {
      type: String,
      default: 'Filter'
    },
    placeholder: String,
    staticLabel: String,
    floatLabel: String,
    stackedLabel: String,
    simple: Boolean,
    align: String,
    readonly: Boolean,
    disable: Boolean,
    delimiter: Boolean
  },
  watch: {
    model: {
      deep: true,
      handler (val) {
        if (this.multiple) {
          this.$emit('input', val)
        }
      }
    }
  },
  data () {
    return {
      terms: ''
    }
  },
  computed: {
    model: {
      get () {
        if (this.multiple && !Array.isArray(this.value)) {
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
      if (this.multiple) {
        return this.options.map(opt => this.model.includes(opt.value))
      }
    },
    visibleOptions () {
      let opts = clone(this.options).map((opt, index) => {
        opt.index = index
        opt.value = this.options[index].value
        return opt
      })
      if (this.filter && this.terms.length) {
        const lowerTerms = this.terms.toLowerCase()
        opts = opts.filter(opt => this.filterFn(lowerTerms, opt))
      }
      return opts
    },
    actualValue () {
      if (this.staticLabel) {
        return this.staticLabel
      }
      if (!this.multiple) {
        let option = this.options.find(option => option.value === this.model)
        return option ? option.label : ''
      }

      let options = this.options
        .filter(opt => this.model.includes(opt.value))
        .map(opt => opt.label)

      return !options.length ? '' : options.join(', ')
    },
    filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
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

    __toggle (value) {
      let index = this.model.indexOf(value)
      if (index > -1) {
        this.model.splice(index, 1)
      }
      else {
        this.model.push(value)
      }
    },
    __select (val) {
      this.model = val
      this.close()
    },
    __blur (e) {
      this.$emit('blur')
      setTimeout(() => {
        if (document.activeElement !== document.body && !this.$refs.popover.$el.contains(document.activeElement)) {
          this.close()
        }
      }, 1)
    },
    __resetFilter () {
      this.terms = ''
    }
  }
}
</script>
