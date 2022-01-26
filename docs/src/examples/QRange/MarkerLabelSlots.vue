<template>
  <div class="q-px-lg q-pt-md q-pb-xl">
    <q-range
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
    </q-range>

    <q-range
      class="q-mt-xl"
      v-model="secondModel"
      color="orange"
      markers
      :min="0"
      :max="5"
      marker-labels
      switch-marker-labels-side
    >
      <template v-slot:marker-label-group="{ markerList }">
        <div
          v-for="val in 4"
          :key="val"
          :class="markerList[val].classes"
          :style="markerList[val].style"
        >{{ val }}</div>

        <q-icon
          v-for="val in [0, 5]"
          :key="val"
          :class="markerList[val].classes"
          :style="markerList[val].style"
          size="sm"
          color="orange"
          :name="val === 0 ? 'volume_off' : 'volume_up'"
        />
      </template>
    </q-range>

    <q-range
      class="q-mt-xl"
      v-model="thirdModel"
      color="teal"
      :left-thumb-color="thirdModel.min === 0 ? 'grey' : 'teal'"
      :right-thumb-color="thirdModel.max === 5 ? 'black' : 'teal'"
      snap
      :min="0"
      :max="5"
      :step="0.5"
      vertical
      marker-labels
    >
      <template v-slot:marker-label-group="{ markerMap }">
        <div
          class="row items-center no-wrap"
          :class="markerMap[thirdModel.min].classes"
          :style="markerMap[thirdModel.min].style"
        >
          <q-icon
            v-if="thirdModel.min === 0"
            size="xs"
            color="teal"
            name="star_outline"
          />

          <template v-else>
            <q-icon
              v-for="i in Math.floor(thirdModel.min)"
              :key="i"
              size="xs"
              color="teal"
              name="star_rate"
            />

            <q-icon
              v-if="thirdModel.min > Math.floor(thirdModel.min)"
              size="xs"
              color="teal"
              name="star_half"
            />
          </template>
        </div>

        <div
          class="row items-center no-wrap"
          :class="markerMap[thirdModel.max].classes"
          :style="markerMap[thirdModel.max].style"
        >
          <q-icon
            v-for="i in Math.floor(thirdModel.max)"
            :key="i"
            size="xs"
            color="teal"
            name="star_rate"
          />

          <q-icon
            v-if="thirdModel.max > Math.floor(thirdModel.max)"
            size="xs"
            color="teal"
            name="star_half"
          />
        </div>
      </template>
    </q-range>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      firstModel: ref({
        min: 2, max: 4
      }),
      secondModel: ref({
        min: 2, max: 4
      }),
      thirdModel: ref({
        min: 2.5, max: 4.5
      })
    }
  }
}
</script>
