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
    :additional-length="additionalLength"

    @click.native="open"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
  >
    <div v-if="hasChips" class="col row items-center group q-input-chips">
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

    <div
      v-else
      class="col row items-center q-input-target"
      :class="[`text-${align}`]"
      v-html="actualValue"
    ></div>

    <q-icon slot="control" name="arrow_drop_down" class="q-if-control"></q-icon>

    <q-popover
      ref="popover"
      fit
      :disable="disable"
      :offset="[0, 10]"
      :anchor-click="false"
      @open="__onFocus"
      @close="__onClose"
      class="column no-wrap"
    >
      <q-toolbar v-if="hasToolbar" :color="color" :inverted="!inverted">
        <q-search
          v-if="filter"
          v-model="terms"
          :placeholder="filterPlaceholder"
          :debounce="50"
          :color="color"
          :inverted="inverted"
        ></q-search>
        <q-toolbar-title v-if="!filter"></q-toolbar-title>
        <q-btn flat v-if="multipleToggle" @click="__toggleAll(false)">
          <q-icon name="check_box_outline_blank" />
        </q-btn>
        <q-btn flat v-if="multipleToggle" @click="__toggleAll(true)">
          <q-icon name="check_box" />
        </q-btn>
      </q-toolbar>

      <q-list
        link
        :delimiter="delimiter"
        class="no-border scroll"
      >
        <template v-if="multiple">
          <q-item-wrapper
            v-for="opt in visibleOptions"
            :key="opt"
            :cfg="opt"
            slot-replace
            @click="__toggle(opt.value)"
          >
            <q-toggle
              v-if="toggle"
              slot="right"
              :value="optModel[opt.index]"
              @click.native="__toggle(opt.value)"
            ></q-toggle>
            <q-checkbox
              v-else
              slot="left"
              :value="optModel[opt.index]"
              @click.native="__toggle(opt.value)"
            ></q-checkbox>
          </q-item-wrapper>
        </template>
        <template v-else>
          <q-item-wrapper
            v-for="opt in visibleOptions"
            :key="opt"
            :cfg="opt"
            slot-replace
            :active="model === opt.value"
            @click="__select(opt.value)"
          >
            <q-radio v-if="radio" slot="primary" :value="model" :val="opt.value"></q-radio>
          </q-item-wrapper>
        </template>
      </q-list>
    </q-popover>
  </q-input-frame>
</template>

<script>
import { QSearch } from '../search'
import { QPopover } from '../popover'
import { QList, QItemWrapper } from '../list'
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
    QList,
    QItemWrapper,
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
    multipleToggle: Boolean,
    radio: Boolean,
    toggle: Boolean,
    chips: Boolean,
    filter: [Function, Boolean],
    filterPlaceholder: {
      type: String,
      default: 'Filter'
    },
    placeholder: String,
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
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        const opt = this.options.find(opt => opt.value === this.value)
        return opt ? opt.label : ''
      }

      const opt = this.selectedOptions.map(opt => opt.label)
      return opt.length ? opt.join(', ') : ''
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
        ? `.q-item-side > ${this.toggle ? '.q-toggle' : '.q-checkbox'} > .active`
        : `.q-item.active`
    },
    hasToolbar () {
      return this.filter || (this.multiple && this.multipleToggle)
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

    __onFocus () {
      this.focused = true
      this.$emit('focus')
      const selected = this.$refs.popover.$el.querySelector(this.activeItemSelector)
      console.log(selected, this.activeItemSelector)
      if (selected) {
        selected.scrollIntoView()
      }
    },
    __onBlur (e) {
      this.__onClose()
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popover.$el.contains(el)) {
          this.close()
        }
      }, 1)
    },
    __onClose () {
      this.focused = false
      this.$emit('blur')
      this.terms = ''
    },
    __toggle (value, select) {
      let index = this.model.indexOf(value)
      if (index > -1) {
        if (select !== true) {
          this.model.splice(index, 1)
        }
      }
      else {
        if (select !== false) {
          this.model.push(value)
        }
      }
    },
    __toggleAll (status) {
      this.visibleOptions.forEach(opt => this.__toggle(opt.value, status))
    },
    __select (val) {
      this.model = val
      this.close()
    }
  }
}
</script>
