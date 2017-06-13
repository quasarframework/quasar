<template>
  <div
    class="q-radio q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center"
    :class="{disabled: disable, reverse: leftLabel}"
    @click.stop.prevent="select"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="select(false)"
  >
    <div class="q-option-inner relative-position" :class="classes">
      <input
        type="radio"
        v-model="model"
        :value="val"
        :disabled="disable"
        @click.stop
        @change="__change"
      >

      <div class="q-focus-helper"></div>

      <q-icon v-if="$q.theme !== 'ios'" class="q-radio-unchecked absolute-full cursor-pointer" :name="uncheckedIcon"></q-icon>
      <q-icon class="q-radio-checked cursor-pointer absolute-full" :name="checkedIcon"></q-icon>

      <div v-if="$q.theme !== 'ios'" ref="ripple" class="q-radial-ripple"></div>
    </div>

    <span class="q-option-label" v-if="label" v-html="label"></span>
    <slot></slot>
  </div>
</template>

<script>
import { current as theme } from '../../features/theme'
import OptionMixin from '../option-group/option-mixin'
import { QIcon } from '../icon'

export default {
  name: 'q-radio',
  mixins: [OptionMixin],
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
    checkedIcon: {
      type: String,
      default: theme === 'ios' ? 'check' : 'radio_button_checked'
    },
    uncheckedIcon: {
      type: String,
      default: 'radio_button_unchecked'
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        if (val !== this.value) {
          this.$emit('input', val)
          this.__onChange(val)
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

      if (!this.disable && this.model !== this.val) {
        this.model = this.val
        this.__onChange(this.val)
      }
    },
    __change (e) {
      if (this.model !== this.val) {
        this.__onChange(this.val)
        this.model = this.val
      }
    },
    __onChange (val) {
      const ref = this.$refs.ripple
      if (val && ref) {
        ref.classList.add('active')
        setTimeout(() => {
          ref.classList.remove('active')
        }, 10)
      }
      this.$emit('change', val)
    }
  }
}
</script>
