<template>
  <div
    class="q-checkbox cursor-pointer inline no-outline"
    :class="{disabled: disable}"
    @click.stop.prevent="toggle"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="toggle"
  >
    <input
      type="checkbox"
      v-model="model"
      :value="val"
      :disabled="disable"
      @click.stop
      @change="__change"
    >
    <div></div>
  </div>
</template>

<script>
import Checkbox from './checkbox-controller'
export default {
  name: 'q-checkbox',
  mixins: [Checkbox]
}
</script>
