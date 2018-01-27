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
    :dark="dark"
    :hide-underline="hideUnderline"
    :before="before"
    :after="after"
    :color="computedColor"

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
        :color="computedChipColor"
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
        :class="[`text-${align}`]"
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

    <q-icon
      v-if="editable"
      :name="computedAddIcon"
      slot="after"
      class="q-if-control self-end"
      :class="{invisible: !input.length}"
      @mousedown.native="__clearTimer"
      @touchstart.native="__clearTimer"
      @click.native="add()"
    ></q-icon>
  </q-input-frame>
</template>

<script>
import FrameMixin from '../../mixins/input-frame'
import InputMixin from '../../mixins/input'
import { QInputFrame } from '../input-frame'
import { QChip } from '../chip'
import { getEventKey, stopAndPrevent } from '../../utils/event'

export default {
  name: 'q-chips-input',
  mixins: [FrameMixin, InputMixin],
  components: {
    QInputFrame,
    QChip
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    frameColor: String,
    readonly: Boolean,
    addIcon: String
  },
  data () {
    return {
      input: '',
      model: [...this.value]
    }
  },
  watch: {
    value (v) {
      this.model = Array.isArray(v) ? [...v] : []
    }
  },
  computed: {
    length () {
      return this.model
        ? this.model.length
        : 0
    },
    computedAddIcon () {
      return this.addIcon || this.$q.icon.chipsInput.add
    },
    computedColor () {
      return this.inverted ? this.frameColor || this.color : this.color
    },
    computedChipColor () {
      if (this.inverted) {
        if (this.frameColor) {
          return this.color
        }
        return this.dark !== false ? 'white' : null
      }
      return this.color
    },
    computedChipTextColor () {
      if (this.inverted) {
        return this.frameColor || this.color
      }
      return this.dark !== false ? 'white' : null
    }
  },
  methods: {
    add (value = this.input) {
      clearTimeout(this.timer)
      this.focus()
      if (this.editable && value) {
        this.model.push(value)
        this.$emit('input', this.model)
        this.input = ''
      }
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
    }
  }
}
</script>
