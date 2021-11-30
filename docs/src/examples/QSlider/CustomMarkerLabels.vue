<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-lg">
      <q-toggle v-model="vertical" dense label="Vertical" />
      <q-toggle v-model="reverse" dense label="Reverse" />
      <q-badge class="q-py-sm q-px-md text-right" color="deep-orange">{{ model }}</q-badge>
    </div>

    <q-slider
      style="max-width: 350px"
      :style="vertical === true ? 'height: 300px; margin-left: 50px' : void 0"
      v-model="model"
      :min="0"
      :max="100"
      :vertical="vertical"
      :reverse="reverse"
      color="deep-orange"
      label-always
      :markers="10"
    >
      <template v-slot:markers="{ min, max, editable, reverse, vertical, styleFn, setFn, stopEvents }">
        <div
          v-for="val in 9"
          :key="val"
          class="q-px-sm q-py-xs"
          :class="`text-deep-orange-${2 + Math.ceil(val / 2) } test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(10 * val).style"
          v-on="stopEvents"
          @click="() => editable === true && setFn(10 * val)"
        >{{ val }}</div>

        <q-icon
          v-for="val in [min, max]"
          :key="val"
          :class="`test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(val).style"
          size="sm"
          :color="val === min ? 'deep-orange-2' : 'deep-orange-8'"
          :name="val === min ? 'volume_off' : 'volume_up'"
          v-on="stopEvents"
          @click="() => editable === true && setFn(val)"
        />
      </template>
    </q-slider>
  </div>
</template>

<script>
export default {
  data () {
    return {
      vertical: false,
      reverse: false,

      model: 10
    }
  }
}
</script>

<style lang="sass" scoped>
.test-marker
  position: absolute
  cursor: pointer

  &--h
    top: -24px
    transform: translate(-50%, -50%)
  &--h-r
    top: -24px
    transform: translate(50%, -50%)
  &--v
    left: -32px
    transform: translate(-50%, -50%)
  &--v-r
    left: -32px
    transform: translate(-50%, 50%)

.q-slider--v::v-deep
  .q-slider__pin--v
    left: auto
    right: 20px
    transform: translateX(-5px) !important

  .q-slider__arrow--v
    left: auto
    right: 15px
    transform: rotate(180deg) translateX(5px) !important
</style>
