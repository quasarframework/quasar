<template>
  <q-input-frame
    class="q-chips-input"

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
    :length="length"
    :additional-length="input.length > 0"

    @click="__onClick"
  >
    <div class="col row items-center group q-input-chips">
      <q-chip
        small
        :closable="editable"
        v-for="(label, index) in model"
        :key="`${label}#${index}`"
        :color="computedChipBgColor"
        :text-color="computedChipTextColor"
        @blur="__onInputBlur"
        @blur.native="__onInputBlur"
        @focus="__clearTimer"
        @focus.native="__clearTimer"
        @hide="remove(index)"
        :tabindex="editable && focused ? 0 : -1"
      >
        {{ label }}
      </q-chip>

      <input
        ref="input"
        class="col q-input-target"
        :class="alignClass"
        v-model="input"

        :placeholder="inputPlaceholder"
        :disabled="disable"
        :readonly="readonly"
        v-bind="$attrs"

        @focus="__onFocus"
        @blur="__onInputBlur"
        @keydown="__handleKeyDown"
        @keyup="__onKeyup"
      />
    </div>

    <q-spinner
      v-if="isLoading"
      slot="after"
      size="24px"
      class="q-if-control"
    ></q-spinner>

    <q-icon
      v-else-if="editable"
      :name="computedAddIcon"
      slot="after"
      class="q-if-control"
      :class="{invisible: !input.length}"
      @mousedown.native="__clearTimer"
      @touchstart.native="__clearTimer"
      @click.native="add()"
    ></q-icon>

    <slot></slot>
  </q-input-frame>
</template>

<script>
import FrameMixin from '../../mixins/input-frame'
import InputMixin from '../../mixins/input'
import { QInputFrame } from '../input-frame'
import { QChip } from '../chip'
import { getEventKey, stopAndPrevent } from '../../utils/event'
import { QSpinner } from '../spinner'

export default {
  name: 'QChipsInput',
  mixins: [FrameMixin, InputMixin],
  components: {
    QInputFrame,
    QChip,
    QSpinner
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    chipsColor: String,
    chipsBgColor: String,
    readonly: Boolean,
    addIcon: String
  },
  data () {
    return {
      input: '',
      model: this.value.slice(),
      watcher: null,
      shadow: {
        val: this.input,
        set: this.add,
        loading: false,
        selectionOpen: false,
        watched: 0,
        isDark: () => this.dark,
        hasFocus: () => document.activeElement === this.$refs.input,
        register: () => {
          this.shadow.watched += 1
          this.__watcherRegister()
        },
        unregister: () => {
          this.shadow.watched = Math.max(0, this.shadow.watched - 1)
          this.__watcherUnregister()
        },
        getEl: () => this.$refs.input
      }
    }
  },
  watch: {
    value (v) {
      this.model = v.slice()
    }
  },
  provide () {
    return {
      __input: this.shadow
    }
  },
  computed: {
    length () {
      return this.model
        ? this.model.length
        : 0
    },
    isLoading () {
      return this.loading || (this.shadow.watched && this.shadow.loading)
    },
    computedAddIcon () {
      return this.addIcon || this.$q.icon.chipsInput.add
    },
    computedChipTextColor () {
      if (this.chipsColor) {
        return this.chipsColor
      }
      if (this.isInvertedLight) {
        return this.invertedLight ? this.color : 'white'
      }
      if (this.isInverted) {
        return this.invertedLight ? 'grey-10' : this.color
      }
      return this.dark
        ? this.color
        : 'white'
    },
    computedChipBgColor () {
      if (this.chipsBgColor) {
        return this.chipsBgColor
      }
      if (this.isInvertedLight) {
        return this.invertedLight ? 'grey-10' : this.color
      }
      if (this.isInverted) {
        return this.invertedLight ? this.color : 'white'
      }
      return this.dark
        ? 'white'
        : this.color
    }
  },
  methods: {
    add (value = this.input) {
      clearTimeout(this.timer)
      this.focus()

      if (this.isLoading || !this.editable || !value) {
        return
      }
      if (this.model.includes(value)) {
        this.$emit('duplicate', value)
        return
      }

      this.model.push(value)
      this.$emit('input', this.model)
      this.input = ''
    },
    remove (index) {
      clearTimeout(this.timer)
      this.focus()
      if (this.editable && index >= 0 && index < this.length) {
        this.model.splice(index, 1)
        this.$emit('input', this.model)
      }
    },
    __clearTimer () {
      this.$nextTick(() => clearTimeout(this.timer))
    },
    __handleKeyDown (e) {
      switch (getEventKey(e)) {
        case 13: // ENTER key
          if (this.shadow.selectionOpen) {
            return
          }
          stopAndPrevent(e)
          return this.add()
        case 8: // Backspace key
          if (!this.input.length && this.length) {
            this.remove(this.length - 1)
          }
          return
        default:
          return this.__onKeydown(e)
      }
    },
    __onClick () {
      this.focus()
    },
    __watcher (value) {
      if (this.shadow.watched) {
        this.shadow.val = value
      }
    },
    __watcherRegister () {
      if (!this.watcher) {
        this.watcher = this.$watch('input', this.__watcher)
      }
    },
    __watcherUnregister (forceUnregister) {
      if (
        this.watcher &&
        (forceUnregister || !this.shadow.watched)
      ) {
        this.watcher()
        this.watcher = null
        this.shadow.selectionOpen = false
      }
    }
  },
  beforeDestroy () {
    this.__watcherUnregister(true)
  }
}
</script>
