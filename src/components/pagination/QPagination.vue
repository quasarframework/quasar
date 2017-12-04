<template>
  <div class="q-pagination" :class="{disabled: disable}">
    <q-btn :disable="value === min" :color="color" flat small round @click="set(min)" :icon="$q.icon.pagination.first"></q-btn>
    <q-btn :disable="value === min" :color="color" flat small round @click="setByOffset(-1)" :icon="$q.icon.pagination.prev"></q-btn>

    <q-input
      ref="input"
      class="inline no-margin"
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

    <q-btn :disable="value === max" :color="color" flat small round @click="setByOffset(1)" :icon="$q.icon.pagination.next"></q-btn>
    <q-btn :disable="value === max" :color="color" flat small round @click="set(max)" :icon="$q.icon.pagination.last"></q-btn>
  </div>
</template>

<script>
import { between } from '../../utils/format'
import { QBtn } from '../btn'
import { QInput } from '../input'

export default {
  name: 'q-pagination',
  components: {
    QBtn,
    QInput
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
          this.$emit('change', value)
        }
      }
    },
    inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
}
</script>
