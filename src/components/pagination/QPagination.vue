<template>
  <div class="q-pagination" :class="{disabled: disable}">
    <q-btn :disable="value === min" :color="color" flat small @click="set(min)">
      <q-icon name="first_page"></q-icon>
    </q-btn>
    <q-btn :disable="value === min" :color="color" flat small @click="setByOffset(-1)">
      <q-icon name="keyboard_arrow_left"></q-icon>
    </q-btn>

    <q-input
      ref="input"
      class="inline"
      type="number"
      v-model="newPage"
      :min="min"
      :max="max"
      :color="color"
      :style="{width: `${inputPlaceholder.length}rem`}"
      :placeholder="inputPlaceholder"
      :disable="disable"
      @keyup.enter="__update"
      @blur="__update"
    ></q-input>

    <q-btn :disable="value === max" :color="color" flat small @click="setByOffset(1)">
      <q-icon name="keyboard_arrow_right"></q-icon>
    </q-btn>
    <q-btn :disable="value === max" :color="color" flat small @click="set(max)">
      <q-icon name="last_page"></q-icon>
    </q-btn>
  </div>
</template>

<script>
import { between } from '../../utils/format'
import { QBtn } from '../btn'
import { QInput } from '../input'
import { QIcon } from '../icon'

export default {
  name: 'q-pagination',
  components: {
    QBtn,
    QInput,
    QIcon
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    disable: Boolean
  },
  data () {
    return {
      newPage: ''
    }
  },
  methods: {
    set (value) {
      if (!this.disable) {
        this.model = value
      }
    },
    setByOffset (offset) {
      if (!this.disable) {
        this.model = this.value + offset
      }
    },
    __normalize (value) {
      return between(parseInt(value, 10), 1, this.max)
    },
    __update () {
      let parsed = parseInt(this.newPage, 10)
      if (parsed) {
        this.model = parsed
        this.$refs.input.blur()
      }

      this.newPage = ''
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (!value) {
          return
        }
        if (value < this.min || value > this.max) {
          return
        }
        if (this.value !== value) {
          this.$emit('input', value)
        }
      }
    },
    inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
}
</script>
