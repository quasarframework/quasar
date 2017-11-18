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
    :color="frameColor || color"

    :focused="focused"
    focusable
    :length="length"
    :additional-length="additionalLength"

    @click.native="open"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
  >
    <div
      v-if="hasChips"
      class="col row items-center group q-input-chips"
      :class="alignClass"
    >
      <q-chip
        v-for="{label, value} in selectedOptions"
        :key="label"
        small
        :closable="!disable"
        :color="color"
        @click.native.stop
        @hide="__toggleMultiple(value)"
      >
        {{ label }}
      </q-chip>
    </div>

    <div
      v-else
      class="col row items-center q-input-target"
      :class="alignClass"
      v-html="actualValue"
    ></div>

    <q-icon
      v-if="!disable && clearable && length"
      slot="after"
      name="cancel"
      class="q-if-control"
      @click.stop="clear"
    ></q-icon>
    <q-icon slot="after" name="arrow_drop_down" class="q-if-control"></q-icon>

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
          :placeholder="filterPlaceholder"
          :debounce="100"
          :color="color"
          icon="filter_list"
          class="no-margin"
          style="min-height: 50px; padding: 10px;"
        ></q-search>
      </q-field-reset>

      <q-list
        link
        :separator="separator"
        class="no-border scroll"
      >
        <template v-if="multiple">
          <q-item-wrapper
            v-for="opt in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            slot-replace
            @click.capture="__toggleMultiple(opt.value)"
          >
            <q-toggle
              v-if="toggle"
              slot="right"
              :color="color"
              :value="optModel[opt.index]"
            ></q-toggle>
            <q-checkbox
              v-else
              slot="left"
              :color="color"
              :value="optModel[opt.index]"
            ></q-checkbox>
          </q-item-wrapper>
        </template>
        <template v-else>
          <q-item-wrapper
            v-for="opt in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            slot-replace
            :active="value === opt.value"
            @click.capture="__singleSelect(opt.value)"
          >
            <q-radio
              v-if="radio"
              :color="color"
              slot="left"
              :value="value"
              :val="opt.value"
            ></q-radio>
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
import SelectMixin from '../../mixins/select'
import clone from '../../utils/clone'

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().indexOf(terms) > -1
}

export default {
  name: 'q-select',
  mixins: [SelectMixin],
  components: {
    QFieldReset,
    QSearch,
    QPopover,
    QList,
    QItemWrapper,
    QCheckbox,
    QRadio,
    QToggle
  },
  props: {
    filter: [Function, Boolean],
    filterPlaceholder: {
      type: String,
      default: 'Filter'
    },
    autofocusFilter: Boolean,
    radio: Boolean,
    placeholder: String,
    separator: Boolean
  },
  computed: {
    optModel () {
      if (this.multiple) {
        return this.value.length > 0
          ? this.options.map(opt => this.value.includes(opt.value))
          : this.options.map(opt => false)
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
    }
  },
  methods: {
    show () {
      if (!this.disable) {
        return this.$refs.popover.show()
      }
    },
    close () {
      if (!this.disable) {
        return this.$refs.popover.hide()
      }
    },
    reposition () {
      const popover = this.$refs.popover
      if (popover.showing) {
        popover.reposition()
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
      this.__onClose()
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popover.$el.contains(el)) {
          this.hide()
        }
      }, 1)
    },
    __onClose () {
      this.focused = false
      this.$emit('blur')
      this.terms = ''
    },
    __singleSelect (val) {
      this.__emit(val)
      this.hide()
    }
  }
}
</script>
