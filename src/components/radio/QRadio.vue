<template>
  <div
    class="q-radio cursor-pointer relative-position no-outline q-focusable"
    :class="{disabled: disable, active: isActive, [`text-${color}`]: isActive && color}"
    @click.stop.prevent="select"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="select(false)"
  >
    <input
      type="radio"
      v-model="model"
      :value="val"
      :disabled="disable"
      @click.stop
      @change="__change"
    >

    <div class="q-focus-helper"></div>

    <q-icon v-if="$q.theme !== 'ios'" class="q-radio-unchecked cursor-pointer" :name="uncheckedIcon"></q-icon>
    <q-icon class="q-radio-checked cursor-pointer absolute-full" :name="checkedIcon"></q-icon>

    <div v-if="$q.theme !== 'ios'" ref="ripple" class="q-radial-ripple"></div>
    <slot></slot>
  </div>
</template>

<script>
import { current as theme } from '../../features/theme'
import { QIcon } from '../icon'

export default {
  name: 'q-radio',
  components: {
    QIcon
  },
  props: {
    value: {
      required: true
    },
    val: {
      required: true
    },
    color: String,
    checkedIcon: {
      type: String,
      default: theme === 'ios' ? 'check' : 'radio_button_checked'
    },
    uncheckedIcon: {
      type: String,
      default: 'radio_button_unchecked'
    },
    disable: Boolean
  },
  watch: {
    isActive (v) {
      const ref = this.$refs.ripple
      if (v && ref) {
        ref.classList.add('active')
        setTimeout(() => {
          ref.classList.remove('active')
        }, 10)
      }
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (value !== this.value) {
          this.$emit('input', value)
        }
      }
    },
    isActive () {
      return this.model === this.val
    }
  },
  methods: {
    select (withBlur) {
      if (withBlur !== false) {
        this.$el.blur()
      }

      if (!this.disable) {
        this.model = this.val
      }
    },
    __change (e) {
      this.model = this.val
    }
  }
}
</script>
