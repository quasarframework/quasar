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
    :no-parent-field="noParentField"

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
        :iconRight="opt.rightIcon"
        :avatar="opt.avatar"
        @click.native.stop
        @hide="__toggleMultiple(opt.value, disable || opt.disable)"
      >
        {{ opt.label }}
      </q-chip>
    </div>

    <div
      v-else
      class="col q-input-target ellipsis"
      :class="fakeInputClasses"
    >
      {{ fakeInputValue }}
    </div>

    <q-icon
      v-if="!disable && !readonly && clearable && length"
      slot="after"
      :name="$q.icon.input.clear"
      class="q-if-control"
      @click.stop.native="clear"
    />
    <q-icon slot="after" :name="$q.icon.input.dropdown" class="q-if-control" />

    <q-popover
      ref="popover"
      fit
      :disable="readonly || disable"
      :anchor-click="false"
      class="column no-wrap"
      :class="dark ? 'bg-dark' : null"
      @show="__onShow"
      @hide="__onClose(true)"
    >
      <q-search
        v-if="filter"
        ref="filter"
        v-model="terms"
        @input="reposition"
        @keydown.native="__keyboardHandleKey"
        :placeholder="filterPlaceholder || $q.i18n.label.filter"
        :debounce="100"
        :color="color"
        :dark="dark"
        no-parent-field
        no-icon
        class="col-auto"
        style="padding: 10px;"
      />

      <q-list
        v-if="visibleOptions.length"
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
            :class="[
              opt.disable ? 'text-faded' : 'cursor-pointer',
              index === keyboardIndex ? 'q-select-highlight' : ''
            ]"
            slot-replace
            @click.capture.native="__toggleMultiple(opt.value, opt.disable)"
            @mouseenter.native="e => !opt.disable && __mouseEnterHandler(e, index)"
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
            :link="!opt.disable"
            :class="[
              opt.disable ? 'text-faded' : 'cursor-pointer',
              index === keyboardIndex ? 'q-select-highlight' : ''
            ]"
            slot-replace
            :active="value === opt.value"
            @click.capture.native="__singleSelect(opt.value, opt.disable)"
            @mouseenter.native="e => !opt.disable && __mouseEnterHandler(e, index)"
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
  name: 'QSelect',
  mixins: [FrameMixin, KeyboardSelectionMixin],
  components: {
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
    keyboardIndex (val) {
      if (this.$refs.popover.showing && this.keyboardMoveDirection && val > -1) {
        this.$nextTick(() => {
          const selected = this.$refs.popover.$el.querySelector('.q-select-highlight')
          if (selected && selected.scrollIntoView) {
            if (selected.scrollIntoViewIfNeeded) {
              return selected.scrollIntoViewIfNeeded(false)
            }
            selected.scrollIntoView(this.keyboardMoveDirection < 0)
          }
        })
      }
    },
    visibleOptions () {
      this.__keyboardCalcIndex()
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
      return this.visibleOptions.length - 1
    },
    filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
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
    }
  },
  methods: {
    togglePopup () {
      this[this.$refs.popover.showing ? 'hide' : 'show']()
    },
    show () {
      this.__keyboardCalcIndex()
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

    __keyboardCalcIndex () {
      this.keyboardIndex = -1
      const sel = this.multiple ? this.selectedOptions.map(o => o.value) : [this.model]
      this.$nextTick(() => {
        const index = sel === void 0 ? -1 : Math.max(-1, this.visibleOptions.findIndex(opt => sel.includes(opt.value)))
        if (index > -1) {
          this.keyboardMoveDirection = true
          setTimeout(() => { this.keyboardMoveDirection = false }, 500)
          this.__keyboardShow(index)
        }
      })
    },
    __keyboardCustomKeyHandle (key, e) {
      switch (key) {
        case 13: // ENTER key
        case 32: // SPACE key
          if (!this.$refs.popover.showing) {
            this.show()
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
      return index > -1 && index < this.visibleOptions.length && !this.visibleOptions[index].disable
    },
    __mouseEnterHandler (e, index) {
      if (!this.keyboardMoveDirection) {
        this.keyboardIndex = index
      }
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
    },
    __onBlur (e) {
      if (!this.focused) {
        return
      }
      setTimeout(() => {
        const el = document.activeElement
        if (
          !this.$refs.popover ||
          !this.$refs.popover.showing ||
          (el !== document.body && !this.$refs.popover.$el.contains(el))
        ) {
          this.__onClose()
          this.hide()
        }
      }, 1)
    },
    __onClose (keepFocus) {
      this.$nextTick(() => {
        if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
          this.$emit('change', this.model)
        }
      })
      this.terms = ''
      if (keepFocus) {
        this.$refs.input && this.$refs.input.$el && this.$refs.input.$el.focus()
        return
      }
      this.focused = false
      this.$emit('blur')
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
      if (this.isInvertedLight) {
        return this.invertedLight ? optColor || this.color : 'white'
      }
      if (this.isInverted) {
        return optColor || (this.invertedLight ? 'grey-10' : this.color)
      }
      return this.dark
        ? optColor || this.color
        : 'white'
    },
    __getChipBgColor (optColor) {
      if (this.chipsBgColor) {
        return this.chipsBgColor
      }
      if (this.isInvertedLight) {
        return this.invertedLight ? 'grey-10' : optColor || this.color
      }
      if (this.isInverted) {
        return this.invertedLight ? this.color : 'white'
      }
      return this.dark
        ? 'white'
        : optColor || this.color
    }
  }
}
</script>
