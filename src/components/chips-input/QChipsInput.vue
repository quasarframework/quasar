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
        v-for="(label, index) in model"
        :key="label"
        :color="color"
        @focus="__clearTimer"
        @hide="remove(index)"
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
      slot="after"
      class="q-if-control self-end"
      :class="{invisible: !input.length}"
      @mousedown="__clearTimer"
      @touchstart="__clearTimer"
      @click="add()"
    ></q-icon>
  </q-input-frame>
</template>

<script>
import FrameMixin from '../../mixins/input-frame'
import InputMixin from '../../mixins/input'
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
      model: [...this.value]
    }
  },
  watch: {
    value (v) {
      if (Array.isArray(v)) {
        this.model = [...v]
      }
      else {
        this.model = []
      }
    }
  },
  computed: {
    length () {
      return this.model
        ? this.model.length
        : 0
    }
  },
  methods: {
    add (value = this.input) {
      clearTimeout(this.timer)
      this.focus()
      if (!this.disable && value) {
        this.model.push(value)
        this.$emit('input', this.model)
        this.input = ''
      }
    },
    remove (index) {
      clearTimeout(this.timer)
      this.focus()
      if (!this.disable && index >= 0 && index < this.length) {
        this.model.splice(index, 1)
        this.$emit('input', this.model)
      }
    },
    __clearTimer () {
      this.$nextTick(() => clearTimeout(this.timer))
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
