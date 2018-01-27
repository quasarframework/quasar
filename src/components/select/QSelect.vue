<template>
  <q-input-frame
    ref="input"
    class="q-select"

    :prefix="prefix"
    :suffix="suffix"
    :stack-label="stackLabel"
    :float-label="floatLabel"
    :error="error"
    :warning="warning"
    :disable="disable"
    :inverted="inverted"
    :dark="dark"
    :hide-underline="hideUnderline"
    :before="before"
    :after="after"
    :color="frameColor || color"

    :focused="focused"
    focusable
    :length="length"
    :additional-length="additionalLength"
    :detailsIcon="computedDetailsIcon"

    @click.native="togglePopup"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
    @keydown.native="__handleKeyDown"
  >
    <div
      v-if="hasChips"
      class="col row items-center group q-input-chips q-if-control"
      :class="alignClass"
    >
      <q-chip
        v-for="{label, value, color: optColor, disable: optDisable} in selectedOptions"
        :key="label"
        small
        :closable="!disable && !optDisable"
        :color="optColor || color"
        @click.native.stop
        @hide="__toggleMultiple(value, disable || optDisable)"
      >
        {{ label }}
      </q-chip>
    </div>

    <div
      v-else
      class="col row items-center q-input-target q-if-control"
      :class="alignClass"
      v-html="actualValue"
    ></div>

    <q-icon
      v-if="!disable && clearable && length"
      slot="after"
      name="cancel"
      class="q-if-control"
      @click.stop.native="clear"
    />

    <q-popover
      ref="popover"
      fit
      :disable="disable"
      :offset="[0, 10]"
      :anchor-click="false"
      class="column no-wrap"
      @show="__onFocus"
      @hide="__onClose"
    >
      <q-field-reset>
        <q-search
          v-if="filter"
          ref="filter"
          v-model="terms"
          @input="reposition"
          :placeholder="filterPlaceholder || $q.i18n.label.filter"
          :debounce="100"
          :color="color"
          icon="filter_list"
          style="min-height: 50px; padding: 10px;"
        />
      </q-field-reset>

      <q-list
        :separator="separator"
        class="no-border scroll"
      >
        <template v-if="multiple">
          <q-item-wrapper
            v-for="opt in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :link="!opt.disable"
            :class="{'text-faded': opt.disable}"
            slot-replace
            @click.capture.native="__toggleMultiple(opt.value, opt.disable)"
          >
            <q-toggle
              v-if="toggle"
              slot="right"
              :color="opt.color || color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
              no-focus
            />
            <q-checkbox
              v-else
              slot="left"
              :color="opt.color || color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
              no-focus
            />
          </q-item-wrapper>
        </template>
        <template v-else>
          <q-item-wrapper
            v-for="opt in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :link="!opt.disable"
            :class="{'text-faded': opt.disable}"
            slot-replace
            :active="value === opt.value"
            @click.capture.native="__singleSelect(opt.value, opt.disable)"
          >
            <q-radio
              v-if="radio"
              :color="opt.color || color"
              slot="left"
              :value="value"
              :val="opt.value"
              :disable="opt.disable"
              no-focus
            />
          </q-item-wrapper>
        </template>
      </q-list>
    </q-popover>
  </q-input-frame>
</template>

<script>
import { QFieldReset } from '../field'
import { QSearch } from '../search'
import { QPopover } from '../popover'
import { QList, QItemWrapper } from '../list'
import { QCheckbox } from '../checkbox'
import { QRadio } from '../radio'
import { QToggle } from '../toggle'
import { QIcon } from '../icon'
import { QInputFrame } from '../input-frame'
import { QChip } from '../chip'
import FrameMixin from '../../mixins/input-frame'
import extend from '../../utils/extend'
import { getEventKey, stopAndPrevent } from '../../utils/event'

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().indexOf(terms) > -1
}

export default {
  name: 'q-select',
  mixins: [FrameMixin],
  components: {
    QFieldReset,
    QSearch,
    QPopover,
    QList,
    QItemWrapper,
    QCheckbox,
    QRadio,
    QToggle,
    QIcon,
    QInputFrame,
    QChip
  },
  props: {
    filter: [Function, Boolean],
    filterPlaceholder: String,
    autofocusFilter: Boolean,
    radio: Boolean,
    placeholder: String,
    separator: Boolean,
    value: { required: true },
    multiple: Boolean,
    toggle: Boolean,
    chips: Boolean,
    options: {
      type: Array,
      required: true,
      validator: v => v.every(o => 'label' in o && 'value' in o)
    },
    frameColor: String,
    displayValue: String,
    clearable: Boolean,
    clearValue: {}
  },
  data () {
    return {
      model: this.multiple && Array.isArray(this.value)
        ? this.value.slice()
        : this.value,
      terms: '',
      focused: false
    }
  },
  watch: {
    value (val) {
      this.model = this.multiple && Array.isArray(val)
        ? val.slice()
        : val
    }
  },
  computed: {
    optModel () {
      if (this.multiple) {
        return this.model.length > 0
          ? this.options.map(opt => this.model.includes(opt.value))
          : this.options.map(opt => false)
      }
    },
    visibleOptions () {
      let opts = this.options.map((opt, index) => extend({}, opt, { index }))
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
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        const opt = this.options.find(opt => opt.value === this.model)
        return opt ? opt.label : ''
      }

      const opt = this.selectedOptions.map(opt => opt.label)
      return opt.length ? opt.join(', ') : ''
    },
    selectedOptions () {
      if (this.multiple) {
        return this.length > 0
          ? this.options.filter(opt => this.model.includes(opt.value))
          : []
      }
    },
    hasChips () {
      return this.multiple && this.chips
    },
    length () {
      return this.multiple
        ? this.model.length
        : ([null, undefined, ''].includes(this.model) ? 0 : 1)
    },
    additionalLength () {
      return this.displayValue && this.displayValue.length > 0
    },
    defaultDetailsIcon () {
      return this.defaultDetailsIconSuggestion
    }
  },
  methods: {
    togglePopup () {
      this[this.$refs.popover.showing ? 'hide' : 'show']()
    },
    show () {
      return this.$refs.popover.show()
    },
    hide () {
      return this.$refs.popover.hide()
    },
    reposition () {
      const popover = this.$refs.popover
      if (popover.showing) {
        popover.reposition()
      }
    },

    __handleKeyDown (e) {
      switch (getEventKey(e)) {
        case 13: // ENTER key
        case 32: // SPACE key
          stopAndPrevent(e)
          return this.show()
        case 8: // Backspace key
          if (this.editable && this.clearable && this.actualValue.length) {
            this.clear()
          }
      }
    },
    __onFocus () {
      this.focused = true
      if (this.filter && this.autofocusFilter) {
        this.$refs.filter.focus()
      }
      this.$emit('focus')
      const selected = this.$refs.popover.$el.querySelector(this.activeItemSelector)
      if (selected) {
        selected.scrollIntoView()
      }
    },
    __onBlur (e) {
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popover.$el.contains(el)) {
          this.__onClose()
          this.hide()
        }
      }, 1)
    },
    __onClose () {
      this.focused = false
      this.$emit('blur')
      this.terms = ''
      this.$nextTick(() => {
        if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
          this.$emit('change', this.model)
        }
      })
    },
    __singleSelect (val, disable) {
      if (disable) {
        return
      }
      this.__emit(val)
      this.hide()
    },
    __toggleMultiple (value, disable) {
      if (disable) {
        return
      }
      const
        model = this.model,
        index = model.indexOf(value)

      if (index > -1) {
        model.splice(index, 1)
      }
      else {
        model.push(value)
      }

      this.$emit('input', model)
    },
    __emit (value) {
      this.$emit('input', value)
      this.$nextTick(() => {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
      })
    },
    __setModel (val) {
      this.model = val || (this.multiple ? [] : null)
      this.$emit('input', this.model)
      if (!this.$refs.popover.showing) {
        this.__onClose()
      }
    }
  }
}
</script>
