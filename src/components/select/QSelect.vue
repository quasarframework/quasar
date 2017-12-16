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

    @mousedown.native="isClick = true"
    @mouseup.native="isClick = false"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
    @keydown.enter.native="$refs.popover.show"
  >
    <template v-if="!loading">
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
          @hide="onHideChip(value)"
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
      />
    </template>
    <q-icon
      slot="after"
      v-if="!loading"
      :name="$q.icon.select.dropdown"
      class="q-if-control"
      :class="{'rotate-180': $refs.popover && $refs.popover.showing}"
    />
    <q-spinner
      v-else
      slot="after"
      size="24px"
      class="q-if-control"
    />

    <q-popover
      ref="popover"
      fit
      :disable="disable"
      :offset="[0, 10]"
      max-height="100vh"
      class="q-select-popover column no-wrap no-scroll"
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
        />
      </q-field-reset>

    <q-list
        ref="list"
        :separator="separator"
        class="no-border scroll"
        :style="{ maxHeight: listMaxHeight }"
        :tabindex="0"
        @keydown="__handleKeydown"
      >
        <template v-if="!emptyText">
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :active="selectedIndex === index"
            :class="getItemClass(opt)"
            slot-replace
            @mouseenter="hoverItem(opt, index)"
            @click.capture="selectItem(opt)"
          >
            <q-toggle
              v-if="multiple && toggle"
              slot="right"
              no-focus
              :color="color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
              no-focus
            />
            <q-checkbox
              v-else-if="multiple"
              slot="left"
              no-focus
              :color="color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
            />
            <q-radio
              v-else-if="radio"
              no-focus
              :color="color"
              slot="left"
              :value="value"
              :val="opt.value"
              :disable="opt.disable"
              no-focus
            />
          </q-item-wrapper>
        </template>
        <q-item v-else class="non-selectable">{{ emptyText }}</q-item>
      </q-list>
    </q-popover>
  </q-input-frame>
</template>

<script>
import { QFieldReset } from '../field'
import { QSearch } from '../search'
import { QPopover } from '../popover'
import { QList, QItemWrapper, QItem } from '../list'
import { QCheckbox } from '../checkbox'
import { QRadio } from '../radio'
import { QToggle } from '../toggle'
import { QSpinner } from '../spinner'
import SelectMixin from '../../mixins/select'
import clone from '../../utils/clone'
import { stopAndPrevent } from '../../utils/event'
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
    QItem,
    QCheckbox,
    QRadio,
    QToggle,
    QSpinner
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
    },
    autoOpen: Boolean,
    loading: Boolean,
    loadingLabel: String,
    noResultsLabel: String,
    noDataLabel: String
  },
  data () {
    return {
      selectedIndex: -1,
      isClick: false
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
    enabledVisibleOptionsCount () {
      return this.visibleOptions.filter(opt => !this.isItemDisabled(opt)).length
    },
    filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
    },
    defaultSelectedIndex () {
      return this.$q.platform.is.desktop && this.enabledVisibleOptionsCount !== 0
        ? this.visibleOptions.findIndex(opt => !this.isItemDisabled(opt))
        : -1
    },
    currentSelectedIndex () {
      return this.multiple
        ? this.visibleOptions.findIndex(opt => this.value.includes(opt.value) && !this.isItemDisabled(opt))
        : this.visibleOptions.findIndex(opt => this.value === opt.value)
    },
    emptyText () {
      if (this.loading) {
        return this.loadingLabel || this.$q.i18n.select.loading
      }
      else {
        if (this.filter && this.terms && this.options.length > 0 && this.visibleOptions.length === 0) {
          return this.noResultsLabel || this.$q.i18n.select.noResults
        }
        if (this.options.length === 0) {
          return this.noDataLabel || this.$q.i18n.select.noData
        }
      }
      return false
    }
  },
  methods: {
    getItemClass (opt) {
      const itemClass = this.isItemDisabled(opt) ? ['disabled', 'cursor-not-allowed'] : ['cursor-pointer']
      if ((this.multiple && this.optModel[opt.index]) || (!this.multiple && this.value === opt.value)) {
        itemClass.push(`text-${this.color}`)
      }
      return itemClass
    },
    selectItem (opt) {
      if (this.isItemDisabled(opt)) {
        return
      }
      this.multiple ? this.__toggleMultiple(opt.value, opt.disable) : this.__singleSelect(opt.value, opt.disable)
    },
    hoverItem (opt, index) {
      if (this.isItemDisabled(opt)) {
        return
      }
      this.selectedIndex = index
    },
    getFocusableElements () {
      let focusableElements = Array.prototype.slice.call(document.querySelectorAll('.q-if-focusable, .q-focusable, input.q-input-target:not([disabled])'))
      return focusableElements.sort((a, b) => {
        a = a.getAttribute('tabindex') || 0
        b = b.getAttribute('tabindex') || 0
        return a > b ? 1 : b > a ? -1 : 0
      })
    },
    onInputFilter () {
      if (this.$refs.popover && this.$refs.popover.showing) {
        this.$refs.popover.reposition()
        this.selectedIndex = this.defaultSelectedIndex
        this.$nextTick(this.scrollToSelectedItem)
      }
    },
    setCurrentSelection () {
      this.selectedIndex >= 0 && this.selectItem(this.visibleOptions[this.selectedIndex])
      !this.multiple && this.$refs.input.$el.focus()
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
    onShowPopover () {
      this.selectedIndex = this.length > 0 ? this.currentSelectedIndex : this.defaultSelectedIndex
      this.filter && this.$q.platform.is.desktop ? this.$refs.filter.focus() : this.$refs.list.focus()
      this.$nextTick(this.scrollToSelectedItem.bind(null, true))
      this.focused = true
    },
    onHidePopover () {
      this.selectedIndex = -1
      this.terms = ''
      this.__onBlur()
    },
    onHideChip (value) {
      this.__toggleMultiple(value)
      if (this.$refs.popover && this.$refs.popover.showing) {
        this.$nextTick(this.onShowPopover)
      }
    },
    __onFocus () {
      if (!this.focused) {
        this.focused = true
        this.$emit('focus')
        if (this.autoOpen && !this.isClick) {
          this.$refs.popover.show()
        }
      }
    },
    __onBlur () {
      this.$nextTick(() => {
        const elm = document.activeElement
        if (document.hasFocus() && (elm === this.$refs.input.$el || this.$refs.popover.$el.contains(elm))) {
          return
        }
        this.focused = false
        this.$emit('blur')
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
      this.$refs.popover.hide()
    },
    __handleKeydown (e) {
      switch (e.keyCode || e.which) {
        case 38: // up
          stopAndPrevent(e)
          this.cursorNavigate(-1)
          break
        case 40: // down
          stopAndPrevent(e)
          this.cursorNavigate(1)
          break
        case 13: // enter
          stopAndPrevent(e)
          this.setCurrentSelection()
          break
        case 27: // escape
          stopAndPrevent(e)
          this.$refs.popover.hide()
          this.$refs.input.$el.focus()
          break
        case 9: // tab
          stopAndPrevent(e)
          this.$refs.popover.hide()
          this.tabNavigate(e.shiftKey ? -1 : 1)
          break
      }
    },
    tabNavigate (offset) {
      let focusableElements = this.getFocusableElements()
      if (focusableElements.length < 2) {
        return
      }
      let tabIndex = focusableElements.findIndex(el => el === this.$refs.input.$el)
      tabIndex = normalizeToInterval(
        tabIndex + offset,
        0,
        focusableElements.length - 1
      )
      focusableElements[tabIndex].focus()
    },
    cursorNavigate (offset) {
      if (this.enabledVisibleOptionsCount === 0) {
        return
      }
      this.selectedIndex = normalizeToInterval(
        this.selectedIndex + offset,
        0,
        this.visibleOptions.length - 1
      )
      this.isItemDisabled(this.visibleOptions[this.selectedIndex]) ? this.cursorNavigate(offset) : this.$nextTick(this.scrollToSelectedItem)
    }
  }
}
</script>
