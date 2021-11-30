<template>
  <div class="q-pa-xl">
    <div class="row items-center q-gutter-md q-mb-xl">
      <q-chip style="min-width: 8em">model1: {{ model1 }}</q-chip>
      <q-chip style="min-width: 8em">model2: {{ model2 }}</q-chip>
      <q-chip style="min-width: 8em">model3: {{ model3 }}</q-chip>

      <q-toggle v-model="vertical" label="Vertical" />
      <q-toggle v-model="reverse" label="Reverse" />
    </div>

    <div class="row items-start q-gutter-xl">
      <q-slider
        style="width: 400px"
        :style="vertical === true ? 'height: 400px' : void 0"
        v-model="model1"
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
            :class="`text-deep-orange-${2 + Math.ceil(val / 2) } test-marker1 test-marker1--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
            :style="styleFn(10 * val).style"
            v-on="stopEvents"
            @click="() => editable === true && setFn(10 * val)"
          >{{ val }}</div>

          <q-icon
            v-for="val in [min, max]"
            :key="val"
            :class="`test-marker1 test-marker1--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
            :style="styleFn(val).style"
            size="sm"
            :color="val === 0 ? 'deep-orange-2' : 'deep-orange-8'"
            :name="val === 0 ? 'volume_off' : 'volume_up'"
            v-on="stopEvents"
            @click="() => editable === true && setFn(val)"
          />
        </template>
      </q-slider>

      <q-slider
        style="width: 20em"
        :style="vertical === true ? 'height: 20em' : void 0"
        v-model="model2"
        :min="0"
        :max="5"
        :step=".5"
        snap
        :vertical="vertical"
        :reverse="reverse"
        color="warning"
      >
        <template v-slot:markers="{ editable, reverse, vertical, styleFn, setFn, stopEvents }">
          <div
            v-for="val in 6"
            :key="val"
            :class="`test-marker2 test-marker2--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
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

      <q-slider
        style="width: 20em"
        :style="vertical === true ? 'height: 20em' : void 0"
        v-model="model3"
        :min="0"
        :max="5"
        :step="0.5"
        :vertical="vertical"
        :reverse="reverse"
        color="warning"
        markers
        snap
      >
        <template v-slot:markers="{ value, reverse, vertical, styleFn }">
          <div
            :class="`test-marker2 test-marker2--${vertical === true ? 'v' : 'h'}${reverse === true ? '-r' : ''}`"
            :style="styleFn(value).style"
          >
            <q-icon
              v-if="value === 0"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      vertical: false,
      reverse: false,

      model1: 10,
      model2: 3,
      model3: 2
    }
  }
}
</script>

<style lang="sass">
.test-marker1
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

.test-marker2
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
