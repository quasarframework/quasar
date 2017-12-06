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

    @focus.native="__onFocus"
    @blur.native="__onBlur"
    @keydown.enter.native="$refs.popover.show"
  >
    <div
      v-if="hasChips"
      class="col row items-center group q-input-chips"
      :class="alignClass"
    >
      <q-chip
        v-for="{label, value, disable: optDisable} in selectedOptions"
        :key="label"
        small
        :closable="!disable && !optDisable"
        :color="color"
        @click.native.stop
        @hide="__toggleMultiple(value, disable || optDisable)"
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
    <q-icon slot="after" :name="$q.icon.select.dropdown" class="q-if-control"></q-icon>

    <q-popover
      ref="popover"
      fit
      :disable="disable"
      :offset="[0, 10]"
      max-height="100vh"
      class="column no-wrap no-scroll"
      @show="onShowPopover"
      @hide="onHidePopover"
    >
      <q-field-reset>
        <q-search
          v-if="filter"
          ref="filter"
          v-model="terms"
          @input="onInputFilter"
          @keydown="__handleKeydown"
          :placeholder="filterPlaceholder || $q.i18n.label.filter"
          :debounce="100"
          :color="color"
          icon="filter_list"
          class="no-margin"
          style="min-height: 50px; padding: 10px;"
        ></q-search>
      </q-field-reset>

    <q-list
        ref="list"
        :separator="separator"
        class="no-border scroll"
        :style="{ maxHeight: listMaxHeight }"
        :tabindex="0"
        @keydown="__handleKeydown"
      >
        <template v-if="multiple">
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :active="selectedIndex === index"
            :link="!opt.disable"
            :class="{'text-light': opt.disable}"
            slot-replace
            @click.capture="__toggleMultiple(opt.value, opt.disable)"
          >
            <q-toggle
              v-if="toggle"
              slot="right"
              :color="color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
            ></q-toggle>
            <q-checkbox
              v-else
              slot="left"
              :color="color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
            ></q-checkbox>
          </q-item-wrapper>
        </template>
        <template v-else>
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :link="!opt.disable"
            slot-replace
            :class="{'text-bold text-primary': value === opt.value && !opt.disable, 'text-light': opt.disable}"
            :active="selectedIndex === index"
            @click.capture="__singleSelect(opt.value, opt.disable)"
          >
            <q-radio
              v-if="radio"
              :color="color"
              slot="left"
              :value="value"
              :val="opt.value"
              :disable="opt.disable"
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
import prevent from '../../utils/prevent'
import { normalizeToInterval } from '../../utils/format'

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
    filterPlaceholder: String,
    radio: Boolean,
    placeholder: String,
    separator: Boolean,
    listMaxHeight: {
      type: String,
      default: '300px'
    }
  },
  data () {
    return {
      selectedIndex: -1
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
    enabledVisibleOptions () {
      return this.visibleOptions.filter(opt => !opt.disable)
    },
    filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
    }
  },
  methods: {
    onInputFilter () {
      const popover = this.$refs.popover
      if (popover.showing) {
        popover.reposition()
        this.selectedIndex = this.$q.platform.is.desktop && this.enabledVisibleOptions.length !== 0
          ? this.visibleOptions.findIndex(opt => !opt.disable)
          : -1
        this.$nextTick(this.scrollToSelectedItem)
      }
    },
    setCurrentSelection () {
      if (this.selectedIndex >= 0 && !this.visibleOptions[this.selectedIndex].disable) {
        this.multiple
          ? this.__toggleMultiple(this.visibleOptions[this.selectedIndex].value)
          : this.__singleSelect(this.visibleOptions[this.selectedIndex].value)
      }
    },
    scrollToSelectedItem (onShow = false) {
      const selected = this.$refs.list.querySelector('.q-item.active')
      if (selected) {
        let offset = 0
        this.$refs.filter && (offset -= this.$refs.filter.$el.clientHeight)
        onShow && (offset += this.$refs.list.clientHeight / 2)
        const selectedTop = selected.offsetTop + offset
        const selectedBottom = selected.offsetTop + selected.offsetHeight + offset
        const listTop = this.$refs.list.scrollTop
        const listBottom = listTop + this.$refs.list.clientHeight
        if (selectedTop < listTop) {
          this.$refs.list.scrollTop = selectedTop
        }
        else if (selectedBottom > listBottom) {
          this.$refs.list.scrollTop = selectedBottom - this.$refs.list.clientHeight
        }
      }
    },
    move (offset) {
      this.selectedIndex = normalizeToInterval(
        this.selectedIndex + offset,
        0,
        this.visibleOptions.length - 1
      )
      this.visibleOptions[this.selectedIndex].disable === true ? this.move(offset) : this.$nextTick(this.scrollToSelectedItem)
    },
    onShowPopover () {
      this.selectedIndex = this.multiple
        ? this.options.findIndex(opt => this.value.includes(opt.value))
        : this.options.findIndex(opt => this.value === opt.value)
      this.filter && this.$q.platform.is.desktop ? this.$refs.filter.focus() : this.$refs.list.focus()
      this.$nextTick(this.scrollToSelectedItem.bind(null, true))
      this.focused = true
    },
    onHidePopover () {
      this.selectedIndex = -1
      this.$refs.input.$el.focus()
      this.terms = ''
      this.__onBlur()
    },
    __onFocus () {
      if (!this.focused) {
        this.focused = true
        this.$emit('focus')
      }
    },
    __onBlur () {
      this.$nextTick(() => {
        const elm = document.activeElement
        if (!document.hasFocus() || (elm !== this.$refs.input.$el && !this.$refs.popover.$el.contains(elm))) {
          this.focused = false
          this.$emit('blur')
          if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
            this.$emit('change', this.model)
          }
        }
      })
    },
    __singleSelect (val, disable) {
      if (disable) {
        return
      }
      this.__emit(val)
      this.$refs.popover.hide()
    },
    __handleKeydown (e) {
      switch (e.keyCode || e.which) {
        case 38: // up
          this.__moveCursor(-1, e)
          break
        case 40: // down
          this.__moveCursor(1, e)
          break
        case 13: // enter
          prevent(e)
          this.setCurrentSelection()
          break
        case 27: // escape
          prevent(e)
          this.$refs.popover.hide()
          break
      }
    },
    __moveCursor (offset, e) {
      prevent(e)
      this.enabledVisibleOptions.length !== 0 && this.move(offset)
    }
  }
}
</script>
