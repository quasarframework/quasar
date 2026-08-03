<template>
  <div>
    <p class="q-pl-lg">Fires on entry and leaving</p>
    <div
      class="q-layout-padding q-ma-lg scroll relative-position"
      style="width: 300px; height: 400px; border: #ccc solid 1px"
    >
      <div
        class="header row justify-around items-center"
        :style="visible1Style"
      >
        {{ visible1 ? 'Visible' : 'Hidden' }}
      </div>
      <div style="width: 100%; height: 2400px">
        <div style="width: 100%; padding-top: 1600px" />
        <div v-intersection="onVisible1" class="observed">Observed Element</div>
      </div>
    </div>

    <p class="q-pl-lg">Fires once on entry</p>
    <div
      class="q-layout-padding q-ma-lg scroll relative-position"
      style="width: 300px; height: 400px; border: #ccc solid 1px"
    >
      <div
        class="header row justify-around items-center"
        :style="visible2Style"
      >
        {{ visible2 ? 'Visible' : 'Hidden' }}
      </div>
      <div style="width: 100%; height: 2400px">
        <div style="width: 100%; padding-top: 1600px" />
        <div v-intersection.once="onVisible2" class="observed"
          >Observed Element</div
        >
      </div>
    </div>

    <div
      class="q-layout-padding q-ma-lg scroll relative-position"
      style="width: 300px; height: 400px; border: #ccc solid 1px"
    >
      <div class="header row justify-around items-center"
        >Percent: {{ percent }}%</div
      >
      <div style="width: 100%; height: 2400px">
        <div style="width: 100%; padding-top: 1600px" />
        <div v-intersection="options" class="observed">Observed Element</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const visible1 = ref(false)
const visible2 = ref(false)
const percent = ref(0)

const visible3 = ref(false)
const intersecting3 = ref(false)

const visible1Style = computed(() => ({
  background: visible1.value === true ? 'green' : 'red',
  color: 'white'
}))
const visible2Style = computed(() => ({
  background: visible2.value === true ? 'green' : 'red',
  color: 'white'
}))
const options = computed(() => ({
  handler: onVisible3,
  cfg: {
    threshold: [0, 0.25, 0.5, 0.75, 1]
  }
}))

function onVisible1(data) {
  visible1.value = data.isIntersecting || data.isVisible
  console.log(data)
}
function onVisible2(data) {
  visible2.value = data.isIntersecting
}
function onVisible3(data) {
  percent.value = (data.intersectionRatio * 100).toFixed(2)
  visible3.value = data.isVisible
  intersecting3.value = data.isIntersecting
}
</script>

<style>
.header {
  background: #ccc;
  font-size: 20px;
  color: #282a37;
  padding: 10px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

.observed {
  font-size: 20px;
  color: #ccc;
  background: #282a37;
  padding: 10px;
}
</style>
