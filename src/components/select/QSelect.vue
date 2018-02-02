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
    :invertedLight="invertedLight"
    :dark="dark"
    :hide-underline="hideUnderline"
    :before="before"
    :after="after"
    :color="color"

    :focused="focused"
    focusable
    :length="length"
    :additional-length="additionalLength"

    @click.native="togglePopup"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
    @keydown.native="__keyboardHandleKey"
  >
    <div
      v-if="hasChips"
      class="col row items-center group q-input-chips"
      :class="alignClass"
    >
      <q-chip
        v-for="opt in selectedOptions"
        :key="opt.label"
        small
        :closable="!disable && !readonly && !opt.disable"
        :color="__getChipBgColor(opt.color)"
        :text-color="__getChipTextColor(opt.color)"
        :icon="opt.icon"
        :iconRight="opt.iconRight"
        :avatar="opt.avatar"
        @click.native.stop
        @hide="__toggleMultiple(opt.value, disable || opt.disable)"
      >
        {{ opt.label }}
      </q-chip>
    </div>

    <input
      v-else
      class="col q-input-target cursor-inherit"
      :class="alignClass"
      :value="actualValue"
      :placeholder="inputPlaceholder"
      readonly
      :disabled="this.disable"
      tabindex="-1"
    />

    <q-icon
      v-if="!disable && !readonly && clearable && length"
      slot="after"
      name="cancel"
      class="q-if-control"
      @click.stop.native="clear"
    />
    <q-icon slot="after" :name="$q.icon.input.dropdown" class="q-if-control" />

    <q-popover
      ref="popover"
      fit
      :disable="readonly || disable"
      :offset="[0, 10]"
      :anchor-click="false"
      class="column no-wrap"
      :class="dark ? 'bg-dark' : null"
      @show="__onShow"
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
          :dark="dark"
          icon="filter_list"
          style="min-height: 50px; padding: 10px;"
        />
      </q-field-reset>

      <q-list
        :separator="separator"
        :dark="dark"
        class="no-border scroll"
      >
        <template v-if="multiple">
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :link="!opt.disable"
            :class="{'text-faded': opt.disable, 'q-select-highlight': index === keyboardIndex}"
            slot-replace
            @click.capture.native="__toggleMultiple(opt.value, opt.disable)"
          >
            <q-toggle
              v-if="toggle"
              slot="right"
              keep-color
              :color="opt.color || color"
              :dark="dark"
              :value="optModel[opt.index]"
              :disable="opt.disable"
              no-focus
            />
            <q-checkbox
              v-else
              slot="left"
              keep-color
              :color="opt.color || color"
              :dark="dark"
              :value="optModel[opt.index]"
              :disable="opt.disable"
              no-focus
            />
          </q-item-wrapper>
        </template>
        <template v-else>
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :class="{'text-faded': opt.disable, 'q-select-highlight': index === keyboardIndex}"
            slot-replace
            :link="!opt.disable"
            :active="value === opt.value"
            @click.capture.native="__singleSelect(opt.value, opt.disable)"
          >
            <q-radio
              v-if="radio"
              keep-color
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
import KeyboardSelectionMixin from '../../mixins/keyboard-selection'

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().indexOf(terms) > -1
}

export default {
  name: 'q-select',
  mixins: [FrameMixin, KeyboardSelectionMixin],
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
    readonly: Boolean,
    options: {
      type: Array,
      required: true,
      validator: v => v.every(o => 'label' in o && 'value' in o)
    },
    chipsColor: String,
    chipsBgColor: String,
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
    },
    keyboardIndex () {
      if (this.$refs.popover.showing) {
        const selected = this.$refs.popover.$el.querySelector('.q-select-highlight')
        if (selected && selected.scrollIntoViewIfNeeded) {
          selected.scrollIntoViewIfNeeded(false)
        }
      }
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
    keyboardMaxIndex () {
      return this.visibleOptions.length
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
    computedColor () {
      return this.inverted ? this.frameColor || this.color : this.color
    }
  },
  methods: {
    togglePopup () {
      this[this.$refs.popover.showing ? 'hide' : 'show']()
    },
    show () {
      this.__keyboardShow(-1)
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

    __keyboardCustomKeyHandle (key, e) {
      switch (key) {
        case 13: // ENTER key
        case 32: // SPACE key
          if (!this.$refs.popover.showing) {
            this.show()
          }
          break
        case 8: // BACKSPACE key
          if (this.editable && this.clearable && this.actualValue.length) {
            this.clear()
          }
          break
      }
    },
    __keyboardShowTrigger () {
      this.show()
    },
    __keyboardSetSelection (index) {
      const opt = this.visibleOptions[index]

      if (this.multiple) {
        this.__toggleMultiple(opt.value, opt.disable)
      }
      else {
        this.__singleSelect(opt.value, opt.disable)
      }
    },
    __keyboardIsSelectableIndex (index) {
      return index > -1 && !this.visibleOptions[index].disable
    },
    __onFocus () {
      if (this.disable || this.focused) {
        return
      }
      this.focused = true
      this.$emit('focus')
    },
    __onShow () {
      if (this.disable) {
        return
      }
      this.__onFocus()
      if (this.filter && this.autofocusFilter) {
        this.$refs.filter.focus()
      }
      const selected = this.$refs.popover.$el.querySelector(this.activeItemSelector)
      if (selected && selected.scrollIntoView) {
        selected.scrollIntoView()
      }
    },
    __onBlur (e) {
      setTimeout(() => {
        const el = document.activeElement
        if (
          !this.$refs.popover.showing ||
          (el !== document.body && !this.$refs.popover.$el.contains(el))
        ) {
          this.__onClose()
          this.hide()
        }
      }, 1)
    },
    __onClose () {
      this.terms = ''
      this.focused = false
      this.$emit('blur')
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
    __setModel (val, forceUpdate) {
      this.model = val || (this.multiple ? [] : null)
      this.$emit('input', this.model)
      if (forceUpdate || !this.$refs.popover.showing) {
        this.__onClose()
      }
    },
    __getChipTextColor (optColor) {
      if (this.chipsColor) {
        return this.chipsColor
      }
      if (this.inverted || this.invertedLight) {
        return optColor || this.color
      }
      return this.dark
        ? optColor || this.color
        : 'white'
    },
    __getChipBgColor (optColor) {
      if (this.chipsBgColor) {
        return this.chipsBgColor
      }
      if (this.inverted) {
        return 'white'
      }
      if (this.invertedLight) {
        return 'grey-8'
      }
      return this.dark
        ? 'white'
        : optColor || this.color
    }
  }
}
</script>
