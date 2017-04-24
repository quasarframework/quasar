<template>
  <div
    class="q-toggle cursor-pointer inline no-outline"
    :class="{disabled: disable}"
    v-touch-swipe.horizontal="__swipe"
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
    <q-icon v-if="icon" :name="icon"></q-icon>
  </div>
</template>

<script>
import Checkbox from '../checkbox/checkbox-controller'
import { QIcon } from '../icon'
import TouchSwipe from '../../directives/touch-swipe'

export default {
  name: 'q-toggle',
  components: {
    QIcon
  },
  directives: {
    TouchSwipe
  },
  mixins: [Checkbox],
  props: {
    icon: String
  },
  methods: {
    __swipe (evt) {
      if (evt.direction === 'left') {
        this.unselect()
      }
      else if (evt.direction === 'right') {
        this.select()
      }
    }
  }
}
</script>
