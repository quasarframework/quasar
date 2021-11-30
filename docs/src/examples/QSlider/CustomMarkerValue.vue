<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-lg">
      <q-toggle v-model="vertical" dense label="Vertical" />
      <q-toggle v-model="reverse" dense label="Reverse" />
      <q-badge class="q-py-sm q-px-md text-right" color="warning">{{ model }}</q-badge>
    </div>

    <q-slider
      style="max-width: 350px"
      :style="vertical === true ? 'height: 20em' : 'margin-bottom: 7em'"
      v-model="model"
      :min="0"
      :max="5"
      :step="0.5"
      :vertical="vertical"
      :reverse="reverse"
      color="warning"
      markers
      snap
    >
      <template v-slot:markers="{ min, value, reverse, vertical, styleFn }">
        <div
          :class="`test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(value).style"
        >
          <q-icon
            v-if="value === min"
            size="xs"
            color="warning"
            name="star_outline"
          />

          <template v-else>
            <q-icon
              v-for="i in Math.floor(value)"
              :key="i"
              size="xs"
              color="warning"
              name="star_rate"
            />

            <q-icon
              v-if="value > Math.floor(value)"
              size="xs"
              color="warning"
              name="star_half"
            />
          </template>
        </div>
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

      model: 2
    }
  }
}
</script>

<style lang="sass" scoped>
.test-marker
  position: absolute

  &--h
    text-align: center
    width: 3em
    top: 16px
    transform: translateX(-50%)
  &--h-r
    text-align: center
    width: 3em
    top: 16px
    transform: translateX(50%)
  &--v
    white-space: nowrap
    left: 16px
    transform: translateY(-50%)
  &--v-r
    white-space: nowrap
    left: 16px
    transform: translateY(50%)
</style>
