<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-lg">
      <q-toggle v-model="vertical" dense label="Vertical" />
      <q-toggle v-model="reverse" dense label="Reverse" />
      <q-toggle v-model="switchLabelSide" dense label="Switch label side" />
      <q-toggle v-model="switchMarkerLabelsPos" dense label="Switch marker label side" />
      <q-badge class="q-py-sm q-px-md text-right" color="deep-orange">{{ model }}</q-badge>
    </div>

    <div class="row items-center no-wrap q-gutter-md">
      <div>Gutter</div>
      <q-slider
        v-model="model"
        v-bind="props"
        color="deep-orange"
        label
        :label-value="'Some long label ' + (10 * model) + '%'"
        :markers="1"
        :marker-labels="v => (10 * v) + '%'"
        label-color="dark"
        track-pattern-img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAH0lEQVQoU2NkYGAwZkAFZ5G5jPRRgOYEVDeB3EBjBQBOZwTVugIGyAAAAABJRU5ErkJggg=="
      />
    </div>

    <q-slider
      style="height: 300px"
      class="q-mt-xl"
      v-model="model"
      v-bind="props"
      color="deep-orange"
      label-always
      :markers="1"
      marker-labels
      :inner-min="2"
      :inner-max="8"
    >
      <template v-slot:marker-label-group="{ markerList }">
        <div
          v-for="marker in markerList"
          :key="marker.index"
          :class="[ `text-deep-orange-${2 + Math.ceil(marker.value / 2) }`, marker.classes ]"
          :style="marker.style"
          @click="model = marker.value"
        >{{ marker.value }}</div>
      </template>
    </q-slider>

    <q-slider
      class="q-mt-xl"
      v-model="model"
      v-bind="props"
      color="deep-orange"
      :markers="3"
      marker-labels
    >
      <template v-slot:marker-label="{ marker }">
        <div
          :class="[ `text-deep-orange-${2 + Math.ceil(marker.value / 2) }`, marker.classes ]"
          :style="marker.style"
          @click="model = marker.value"
        >{{ marker.value }}</div>
      </template>
    </q-slider>

    <q-slider
      class="q-mt-xl"
      v-model="model"
      v-bind="props"
      color="yellow-9"
      thumb-color="purple"
      label-color="black"
      label
      markers
      :marker-labels="[ 0, 3, 6, 9, 10 ]"
    />

    <q-slider
      class="q-mt-xl"
      style="max-width: 350px"
      v-model="model"
      v-bind="props"
      color="green"
      :markers="1"
      track-size="50px"
      thumb-size="30px"
      thumb-color="black"
      label-color="purple"
      label
      label-always
      marker-labels
    >
      <template v-slot:marker-label-group="{ markerList }">
        <div
          v-for="val in 9"
          :key="val"
          class="cursor-pointer"
          :class="[ `text-deep-orange-${2 + Math.ceil(markerList[val].value / 2) }`, markerList[val].classes ]"
          :style="markerList[val].style"
          @click="model = val"
        >{{ val }}</div>

        <q-icon
          v-for="val in [0, 10]"
          :key="val"
          :class="[ `cursor-pointer text-deep-orange-${2 + Math.ceil(markerList[val].value / 2) }`, markerList[val].classes ]"
          :style="markerList[val].style"
          size="sm"
          :color="val === 0 ? 'deep-orange-2' : 'deep-orange-8'"
          :name="val === 0 ? 'volume_off' : 'volume_up'"
          @click="model = val"
        />
      </template>
    </q-slider>

    <q-slider
      class="q-mt-xl"
      style="max-width: 350px"
      v-model="model"
      v-bind="props"
      color="deep-orange"
      :markers="1"
      snap
      marker-labels
    >
      <template v-slot:marker-label-group="{ markerMap }">
        <div
          class="row items-center no-wrap"
          :class="markerMap[model].classes"
          :style="markerMap[model].style"
        >
          <q-icon
            v-if="model === 0"
            size="xs"
            color="warning"
            name="star_outline"
          />

          <template v-else>
            <q-icon
              v-for="i in Math.floor(model)"
              :key="i"
              size="xs"
              color="warning"
              name="star_rate"
            />

            <q-icon
              v-if="model > Math.floor(model)"
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
      switchLabelSide: false,
      switchMarkerLabelsPos: false,

      model: 4
    }
  },

  computed: {
    props () {
      return {
        min: 0,
        max: 10,
        vertical: this.vertical,
        reverse: this.reverse,
        switchLabelSide: this.switchLabelSide,
        switchMarkerLabelsSide: this.switchMarkerLabelsPos
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.test-marker
  cursor: pointer
  width: 24px
  height: 24px
  display: flex
  align-items: center
  justify-content: center
</style>
