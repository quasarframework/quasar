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
      ></q-icon>
    </template>
    <q-icon
      slot="after"
      v-if="!loading"
      :name="$q.icon.select.dropdown"
      class="q-if-control"
      :class="{'rotate-180': $refs.popover && $refs.popover.showing}"
    ></q-icon>
    <q-spinner
      v-else
      slot="after"
      size="24px"
      class="q-if-control"
    ></q-spinner>

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
        <template v-if="multiple && visibleOptions.length > 0 && !loading">
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :active="selectedIndex === index"
            @mouseenter="hoverItem(opt, index)"
            :class="{'text-light cursor-not-allowed': opt.disable, 'cursor-pointer': !opt.disable}"
            slot-replace
            @click.capture="__toggleMultiple(opt.value, opt.disable)"
          >
            <q-toggle
              v-if="toggle"
              slot="right"
              :focusable="false"
              :color="color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
            ></q-toggle>
            <q-checkbox
              v-else
              slot="left"
              :focusable="false"
              :color="color"
              :value="optModel[opt.index]"
              :disable="opt.disable"
            ></q-checkbox>
          </q-item-wrapper>
        </template>
        <template v-else-if="visibleOptions.length > 0 && !loading">
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            slot-replace
            :class="{'text-bold text-primary': value === opt.value && !opt.disable, 'text-light cursor-not-allowed': opt.disable, 'cursor-pointer': !opt.disable}"
            :active="selectedIndex === index"
            @mouseenter="hoverItem(opt, index)"
            @click.capture="__singleSelect(opt.value, opt.disable)"
          >
            <q-radio
              v-if="radio"
              :focusable="false"
              :color="color"
              slot="left"
              :value="value"
              :val="opt.value"
              :disable="opt.disable"
            ></q-radio>
          </q-item-wrapper>
        </template>
        <q-item v-else-if="emptyText" class="text-center non-selectable block">{{ emptyText }}</q-item>
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
      return this.visibleOptions.filter(opt => !opt.disable).length
    },
    filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
    },
    defaultSelectedIndex () {
      return this.$q.platform.is.desktop && this.enabledVisibleOptionsCount !== 0
        ? this.visibleOptions.findIndex(opt => !opt.disable)
        : -1
    },
    currentSelectedIndex () {
      return this.multiple
        ? this.visibleOptions.findIndex(opt => this.value.includes(opt.value) && !opt.disable)
        : this.visibleOptions.findIndex(opt => this.value === opt.value)
    },
    emptyText () {
      if (this.loading) {
        return this.loadingLabel || this.$q.i18n.table.loader
      }
      else {
        if (this.filter && this.terms && this.options.length > 0 && this.visibleOptions.length === 0) {
          return this.noResultsLabel || this.$q.i18n.table.noResults
        }
        if (this.options.length === 0) {
          return this.noDataLabel || this.$q.i18n.table.noData
        }
      }
      return false
    }
  },
  methods: {
    hoverItem (opt, index) {
      if (!opt.disable) {
        this.selectedIndex = index
      }
    },
    getFocusableElements () {
      return Array.prototype.slice.call(document.querySelectorAll('.q-if-focusable, .q-focusable, input.q-input-target:not([disabled])'))
    },
    onInputFilter () {
      if (this.$refs.popover && this.$refs.popover.showing) {
        // this.$refs.popover.reposition() // ??? .. jumps around the screen when located at the top of the field
        this.selectedIndex = this.defaultSelectedIndex
        this.$nextTick(this.scrollToSelectedItem)
      }
    },
    setCurrentSelection () {
      if (this.selectedIndex >= 0 && !this.visibleOptions[this.selectedIndex].disable) {
        if (this.multiple) {
          this.__toggleMultiple(this.visibleOptions[this.selectedIndex].value)
        }
        else {
          this.__singleSelect(this.visibleOptions[this.selectedIndex].value)
          this.$refs.input.$el.focus()
        }
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
          prevent(e)
          this.cursorNavigate(-1)
          break
        case 40: // down
          prevent(e)
          this.cursorNavigate(1)
          break
        case 13: // enter
          prevent(e)
          this.setCurrentSelection()
          break
        case 27: // escape
          prevent(e)
          this.$refs.popover.hide()
          this.$refs.input.$el.focus()
          break
        case 9: // tab
          prevent(e)
          this.$refs.popover.hide()
          this.tabNavigate(e.shiftKey ? -1 : 1)
          break
      }
    },
    tabNavigate (offset) {
      let fosableElements = this.getFocusableElements()
      if (fosableElements.length < 2) {
        return
      }
      let tabIndex = fosableElements.findIndex(el => el === this.$refs.input.$el)
      tabIndex = normalizeToInterval(
        tabIndex + offset,
        0,
        fosableElements.length - 1
      )
      fosableElements[tabIndex].focus()
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
      this.visibleOptions[this.selectedIndex].disable === true ? this.cursorNavigate(offset) : this.$nextTick(this.scrollToSelectedItem)
    }
  }
}
</script>
