<template>
  <q-btn-group
    :outline="outline"
    :flat="flat"
    :rounded="rounded"
    :push="push"
    class="q-btn-toggle-group"
  >
    <q-btn-toggle
      v-for="(opt, i) in options"
      :key="`${opt.label}${opt.icon}${opt.iconRight}`"
      :toggled="val[i]"
      @change="set(opt.value, opt)"
      :label="opt.label"
      :color="opt.color || color"
      :toggle-color="opt.toggleColor || toggleColor"
      :icon="opt.icon"
      :icon-right="opt.iconRight"
      :no-caps="noCaps"
      :no-wrap="noWrap"
      :outline="outline"
      :flat="flat"
      :rounded="rounded"
      :push="push"
      :glossy="glossy"
      :small="small"
      :big="big"
      :compact="compact"
    ></q-btn-toggle>
  </q-btn-group>
</template>

<script>
import QBtnGroup from './QBtnGroup'
import QBtnToggle from './QBtnToggle.vue'

export default {
  name: 'q-btn-toggle-group',
  components: {
    QBtnGroup,
    QBtnToggle
  },
  props: {
    value: {
      required: true
    },
    color: String,
    toggleColor: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: v => v.every(opt => ('label' in opt || 'icon' in opt) && 'value' in opt)
    },
    disable: Boolean,
    noCaps: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    small: Boolean,
    big: Boolean,
    glossy: Boolean
  },
  computed: {
    val () {
      return this.options.map(opt => opt.value === this.value)
    }
  },
  methods: {
    set (value, opt) {
      if (value !== this.value) {
        this.$emit('input', value)
        this.$emit('change', value, opt)
      }
    }
  }
}
</script>
