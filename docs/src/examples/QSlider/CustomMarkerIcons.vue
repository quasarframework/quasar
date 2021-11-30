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
      snap
      :vertical="vertical"
      :reverse="reverse"
      color="warning"
    >
      <template v-slot:markers="{ editable, reverse, vertical, styleFn, setFn, stopEvents }">
        <div
          v-for="val in 6"
          :key="val"
          :class="`test-marker test-marker--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
          :style="styleFn(val - 1).style"
        >
          <q-icon
            v-if="val === 1"
            size="sm"
            color="warning"
            name="star_outline"
            v-on="stopEvents"
            @click="() => editable === true && setFn(0)"
          />

          <template v-else>
            <q-icon
              v-for="i in val - 1"
              :key="i"
              size="sm"
              color="warning"
              name="star_rate"
              v-on="stopEvents"
              @click="() => editable === true && setFn(val - 1)"
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

      model: 3
    }
  }
}
</script>

<style lang="sass" scoped>
.test-marker
  position: absolute
  cursor: pointer

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
