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

    @click.native="show"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
    @keydown.native="__handleKeydown"
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
          @focus="onFocusFilter"
          :placeholder="filterPlaceholder"
          :debounce="100"
          :color="color"
          icon="filter_list"
          class="no-margin"
          style="min-height: 50px; padding: 10px;"
        ></q-search>
      </q-field-reset>

    <q-list
        ref="list"
        link
        :separator="separator"
        class="no-border scroll"
        :style="{ maxHeight: listMaxHeight }"
      >
        <template v-if="multiple">
          <q-item-wrapper
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            :active="selectedIndex === index"
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
            v-for="(opt, index) in visibleOptions"
            :key="JSON.stringify(opt)"
            :cfg="opt"
            slot-replace
            :class="{'text-bold text-primary': value === opt.value}"
            :active="selectedIndex === index"
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
    filterPlaceholder: {
      type: String,
      default: 'Filter'
    },
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
      listShowing: false
    }
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
    }
  },
  methods: {
    show () {
      if (this.disable || this.listShowing) {
        return Promise.reject(new Error())
      }
      this.listShowing = true
      if (this.multiple) {
        this.selectedIndex = this.options.findIndex(opt => this.value.includes(opt.value))
      }
      else {
        this.selectedIndex = this.options.findIndex(opt => this.value === opt.value)
      }
      return this.$refs.popover.show()
    },
    hide () {
      this.selectedIndex = -1
      return this.$refs.popover.hide()
    },
    onInputFilter () {
      const popover = this.$refs.popover
      if (popover.showing) {
        popover.reposition()
        this.selectedIndex = this.$q.platform.is.desktop ? 0 : -1
        this.$nextTick(this.scrollToSelectedItem)
      }
    },
    onFocusFilter () {
      this.$nextTick(() => {
        this.listShowing = true
      })
    },
    setCurrentSelection () {
      if (this.selectedIndex >= 0 && this.visibleOptions[this.selectedIndex]) {
        if (this.multiple) {
          this.__toggleMultiple(this.visibleOptions[this.selectedIndex].value)
        }
        else {
          this.__emit(this.visibleOptions[this.selectedIndex].value)
          this.__onEscape()
        }
      }
    },
    scrollToSelectedItem (onOpen = false) {
      const selected = this.$refs.list.querySelector('.q-item.active')
      if (selected) {
        let offset = 0
        if (this.$refs.filter) {
          offset -= this.$refs.filter.$el.clientHeight
        }
        if (onOpen) {
          offset += this.$refs.list.clientHeight / 2
        }
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
      this.$nextTick(this.scrollToSelectedItem)
    },
    onShowPopover () {
      if (this.filter && this.$q.platform.is.desktop) {
        this.$refs.filter.focus()
      }
      this.$nextTick(this.scrollToSelectedItem.bind(null, true))
    },
    onHidePopover () {
      this.terms = ''
      this.$nextTick(() => {
        this.listShowing = false
      })
    },
    __onFocus () {
      this.focused = true
      this.$emit('focus')
    },
    __onBlur (e) {
      this.focused = false
      this.$emit('blur')
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popover.$el.contains(el)) {
          this.hide()
        }
      }, 1)
    },
    __onEscape () {
      this.hide()
      this.$refs.input.$el.focus()
    },
    __singleSelect (val) {
      this.__emit(val)
      this.hide()
    },
    __handleKeydown (e) {
      if (this.$refs.popover.showing) {
        switch (e.keyCode || e.which) {
          case 38: // up
            this.__moveCursor(-1, e)
            break
          case 40: // down
            this.__moveCursor(1, e)
            break
          case 13: // enter
            this.setCurrentSelection()
            prevent(e)
            break
          case 27: // escape
            this.__onEscape()
            prevent(e)
            break
        }
      }
      else if (e.keyCode === 13 || e.which === 13) { // enter
        this.show()
        if (this.filter) {
          this.$nextTick(this.$refs.filter.focus)
        }
        prevent(e)
      }
    },
    __moveCursor (offset, e) {
      prevent(e)
      this.move(offset)
    }
  }
}
</script>
