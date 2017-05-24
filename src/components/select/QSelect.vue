<template>
  <q-input-frame
    ref="input"
    class="q-select"

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
    :color="frameColor"
    :align="align"

    :focused="focused"
    focusable
    :length="length"

    @click.native="open"
    @focus.native="__onOpen"
    @blur.native="__onBlur"
  >
    <div v-if="hasChips" class="col row group">
      <q-chip
        v-for="{label, value} in selectedOptions"
        :key="label"
        small
        :closable="!disable"
        :color="color"
        @click.native.stop
        @close="__toggle(value)"
      >
        {{ label }}
      </q-chip>
    </div>

    <div v-else class="col row q-input-target" :class="[`text-${align}`]" v-html="actualValue"></div>

    <q-icon slot="control" name="arrow_drop_down" class="q-if-control"></q-icon>

    <q-popover
      ref="popover"
      fit
      :disable="disable"
      :offset="[0, 10]"
      :anchor-click="false"
      @open="__onOpen"
      @close="__onClose"
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
            @click.native="__toggle(opt.value)"
            no-ripple
          >
            <q-toggle
              v-if="toggle"
              slot="secondary"
              :value="optModel[opt.index]"
              @click.native="__toggle(opt.value)"
            ></q-toggle>
            <q-checkbox
              v-else
              slot="primary"
              :value="optModel[opt.index]"
              @click.native="__toggle(opt.value)"
            ></q-checkbox>
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
            no-ripple
          >
            <q-radio v-if="radio" slot="primary" :value="model" :val="opt.value"></q-radio>
          </q-item>
        </template>
      </div>
    </q-popover>
  </q-input-frame>
</template>

<script>
import { QSearch } from '../search'
import { QPopover } from '../popover'
import { QItem } from '../item'
import { QCheckbox } from '../checkbox'
import { QRadio } from '../radio'
import { QToggle } from '../toggle'
import { QChip } from '../chip'
import SelectMixin from './select-mixin'
import clone from '../../utils/clone'

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().startsWith(terms)
}

export default {
  name: 'q-select',
  mixins: [SelectMixin],
  components: {
    QSearch,
    QPopover,
    QItem,
    QCheckbox,
    QRadio,
    QToggle,
    QChip
  },
  props: {
    value: {
      required: true
    },
    multiple: Boolean,
    radio: Boolean,
    toggle: Boolean,
    chips: Boolean,
    filter: [Function, Boolean],
    filterPlaceholder: {
      type: String,
      default: 'Filter'
    },
    placeholder: String,
    align: String,
    disable: Boolean,
    delimiter: Boolean
  },
  watch: {
    model: {
      deep: true,
      handler (val) {
        const popover = this.$refs.popover
        if (popover.opened) {
          popover.reposition()
        }
        if (this.multiple) {
          this.$emit('input', val)
        }
      }
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
    actualValue () {
      if (!this.multiple) {
        let option = this.options.find(option => option.value === this.model)
        return option ? option.label : ''
      }

      let options = this.selectedOptions.map(opt => opt.label)
      return !options.length ? '' : options.join(', ')
    },
    optModel () {
      /* Used by multiple selection only */
      if (this.multiple) {
        return this.options.map(opt => this.model.includes(opt.value))
      }
    },
    selectedOptions () {
      if (this.multiple) {
        return this.options.filter(opt => this.model.includes(opt.value))
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
    filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
    },
    activeItemSelector () {
      return this.multiple
        ? `.item-${this.toggle ? 'secondary' : 'primary'} > .active`
        : `.item.active`
    }
  },
  methods: {
    open (event) {
      if (!this.disable) {
        this.$refs.popover.open()
      }
    },
    close () {
      this.$refs.popover.close()
    },

    __onOpen () {
      this.focused = true
      this.$emit('focus')
      const selected = this.$refs.popover.$el.querySelector(this.activeItemSelector)
      if (selected) {
        selected.scrollIntoView()
      }
    },
    __onClose () {
      this.focused = false
      this.$emit('blur')
      this.terms = ''
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
    __onBlur (e) {
      setTimeout(() => {
        if (document.activeElement !== document.body && !this.$refs.popover.$el.contains(document.activeElement)) {
          this.close()
        }
      }, 1)
    }
  }
}
</script>
