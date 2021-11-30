<template>
  <div class="q-px-md q-py-lg">
    <div class="row items-center q-gutter-sm q-mb-lg">
      <q-toggle v-model="vertical" dense label="Vertical" />
      <q-toggle v-model="reverse" dense label="Reverse" />
      <q-badge color="secondary">
        Model: {{ model.min }} to {{ model.max }}
      </q-badge>
    </div>

    <q-range
      style="max-width: 350px"
      :style="vertical === true ? 'height: 20em' : void 0"
      v-model="model"
      :min="0"
      :max="20"
      :vertical="vertical"
      :reverse="reverse"
      color="primary"
      markers
      snap
      drag-range
    >
      <template v-slot:markers="{ min, max, value, reverse, vertical, styleFn }">
        <div
          class="text-grey-6"
          :class="`test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(min).style"
        >{{ min }}</div>

        <div
          class="text-grey-6"
          :class="`test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(max).style"
        >{{ max }}</div>

        <q-icon
          :class="`test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(value.min).style"
          size="sm"
          color="primary"
          :name="icons.start"
        />

        <q-icon
          :class="`test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(value.max).style"
          size="sm"
          color="primary"
          :name="icons.end"
        />
      </template>
    </q-range>
  </div>
</template>

<script>
export default {
  data () {
    return {
      vertical: false,
      reverse: false,

      model: {
        min: 2,
        max: 5
      }
    }
  },

  computed: {
    icons () {
      if (this.vertical === true) {
        return this.reverse === true
          ? {
            start: 'keyboard_double_arrow_up',
            end: 'keyboard_double_arrow_down'
          }
          : {
            start: 'keyboard_double_arrow_down',
            end: 'keyboard_double_arrow_up'
          }
      }

      return this.reverse === true
        ? {
          start: 'keyboard_double_arrow_left',
          end: 'keyboard_double_arrow_right'
        }
        : {
          start: 'keyboard_double_arrow_right',
          end: 'keyboard_double_arrow_left'
        }
    }
  }
}
</script>

<style lang="sass" scoped>
.test-marker
  position: absolute

  &--h
    top: 16px
    transform: translateX(-50%)
  &--h-r
    top: 16px
    transform: translateX(50%)
  &--v
    left: 16px
    transform: translateY(-50%)
  &--v-r
    left: 16px
    transform: translateY(50%)
</style>
