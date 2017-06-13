<template>
  <q-input-frame
    class="q-chips-input"

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
    :color="inverted ? frameColor || color : color"

    :focused="focused"
    :length="length"
    :additional-length="input.length > 0"

    @click="__onClick"
  >
    <div class="col row items-center group q-input-chips">
      <q-chip
        small
        :closable="!disable"
        v-for="(label, index) in value"
        :key="index"
        :color="color"
        @close="remove(index)"
      >
        {{ label }}
      </q-chip>

      <input
        ref="input"
        class="col q-input-target"
        :class="[`text-${align}`]"
        v-model="input"

        :name="name"
        :placeholder="inputPlaceholder"
        :disabled="disable"
        :max-length="maxLength"

        @focus="__onFocus"
        @blur="__onInputBlur"
        @keydown="__handleKey"
        @keyup="__onKeyup"
      />
    </div>

    <q-icon
      v-if="!disable"
      name="send"
      slot="control"
      class="q-if-control self-end"
      :class="{invisible: !input.length}"
      @click="add()"
    ></q-icon>
  </q-input-frame>
</template>

<script>
import FrameMixin from '../input-frame/input-frame-mixin'
import InputMixin from '../input/input-mixin'
import { QInputFrame } from '../input-frame'
import { QChip } from '../chip'

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
    frameColor: String
  },
  data () {
    return {
      input: '',
      focused: false
    }
  },
  computed: {
    length () {
      return this.value
        ? this.value.length
        : 0
    }
  },
  methods: {
    add (value = this.input) {
      if (!this.disable && value) {
        this.value.push(value)
        this.$emit('change', this.value)
        this.input = ''
      }
    },
    remove (index) {
      if (!this.disable && index >= 0 && index < this.length) {
        this.value.splice(index, 1)
        this.$emit('change', this.value)
      }
    },
    __onInputBlur (e) {
      this.__onBlur(e)
    },
    __handleKey (e) {
      // ENTER key
      if (e.which === 13 || e.keyCode === 13) {
        this.add()
      }
      // Backspace key
      else if (e.which === 8 || e.keyCode === 8) {
        if (!this.input.length && this.length) {
          this.remove(this.length - 1)
        }
      }
      else {
        this.__onKeydown(e)
      }
    },
    __onClick () {
      this.focus()
    }
  }
}
</script>
