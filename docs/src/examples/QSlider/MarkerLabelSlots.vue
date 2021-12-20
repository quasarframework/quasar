<template>
  <div class="q-px-lg q-pt-md q-pb-xl">
    <q-slider
      class="q-mt-xl"
      v-model="firstModel"
      color="deep-orange"
      label-always
      markers
      marker-labels
      :min="1"
      :max="10"
      :inner-min="2"
      :inner-max="8"
    >
      <template v-slot:marker-label-group="scope">
        <div
          v-for="marker in scope.markerList"
          :key="marker.index"
          :class="[ `text-deep-orange-${2 + Math.ceil(marker.value / 2) }`, marker.classes ]"
          :style="marker.style"
          @click="model = marker.value"
        >{{ marker.value }}</div>
      </template>
    </q-slider>

    <q-slider
      class="q-mt-xl"
      v-model="secondModel"
      color="orange"
      markers
      :min="0"
      :max="5"
      marker-labels
    >
      <template v-slot:marker-label-group="{ markerList }">
        <div
          v-for="val in 4"
          :key="val"
          class="cursor-pointer"
          :class="markerList[val].classes"
          :style="markerList[val].style"
          @click="secondModel = val"
        >{{ val }}</div>

        <q-icon
          v-for="val in [0, 5]"
          :key="val"
          :class="markerList[val].classes"
          :style="markerList[val].style"
          size="sm"
          color="orange"
          :name="val === 0 ? 'volume_off' : 'volume_up'"
          @click="secondModel = val"
        />
      </template>
    </q-slider>

    <q-slider
      class="q-mt-xl"
      v-model="thirdModel"
      color="teal"
      :thumb-color="thirdModel === 0 ? 'grey' : 'teal'"
      snap
      :min="0"
      :max="5"
      :step="0.5"
      marker-labels
      switch-marker-labels-side
    >
      <template v-slot:marker-label-group="{ markerMap }">
        <div
          class="row items-center no-wrap"
          :class="markerMap[thirdModel].classes"
          :style="markerMap[thirdModel].style"
        >
          <q-icon
            v-if="thirdModel === 0"
            size="xs"
            color="teal"
            name="star_outline"
          />

          <template v-else>
            <q-icon
              v-for="i in Math.floor(thirdModel)"
              :key="i"
              size="xs"
              color="teal"
              name="star_rate"
            />

            <q-icon
              v-if="thirdModel > Math.floor(thirdModel)"
              size="xs"
              color="teal"
              name="star_half"
            />
          </template>
        </div>
      </template>
    </q-slider>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      firstModel: ref(2),
      secondModel: ref(3),
      thirdModel: ref(3.5)
    }
  }
}
</script>
