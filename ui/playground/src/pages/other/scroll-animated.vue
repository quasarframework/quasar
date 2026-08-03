<template>
  <div ref="scrollableEl" class="absolute-full scroll text-dark">
    <div class="animation-scroll-test" />

    <div
      class="fixed-top-left q-ma-lg q-pa-sm rounded-borders column"
      style="background: rgba(200, 200, 200, 0.4)"
    >
      <q-input
        type="number"
        v-model="duration"
        :step="1"
        :min="100"
        :max="10000"
        label="Duration (ms)"
        outlined
        dense
        :dark="false"
        input-class="text-right"
        style="width: 7em"
      />
      <q-btn unelevated class="q-mt-md" label="Scroll" @click="scroll" />
    </div>

    <div
      class="fixed-bottom-left q-ma-lg q-pa-sm rounded-borders column text-no-wrap"
      style="width: 320px; background: rgba(200, 200, 200, 0.4)"
    >
      <div class="row no-wrap">
        <div class="col-2">&nbsp;</div>
        <div class="col-2 text-right text-weight-medium">Left</div>
        <div class="col-3 text-right text-weight-medium">Time X</div>
        <div class="col-2 text-right text-weight-medium">Top</div>
        <div class="col-3 text-right text-weight-medium">Time Y</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">From</div>
        <div class="col-2 text-grey-8 text-right">{{ from.left }}</div>
        <div class="col-3 text-grey-8 text-right">{{
          from.timeX.toFixed(2).slice(-8)
        }}</div>
        <div class="col-2 text-grey-8 text-right">{{ from.top }}</div>
        <div class="col-3 text-grey-8 text-right">{{
          from.timeY.toFixed(2).slice(-8)
        }}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">To</div>
        <div class="col-2 text-grey-8 text-right">{{ to.left }}</div>
        <div class="col-3 text-grey-8 text-right">{{
          to.timeX.toFixed(2).slice(-8)
        }}</div>
        <div class="col-2 text-grey-8 text-right">{{ to.top }}</div>
        <div class="col-3 text-grey-8 text-right">{{
          to.timeY.toFixed(2).slice(-8)
        }}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">Diff</div>
        <div class="col-2 text-weight-medium text-right">{{ diff.left }}</div>
        <div class="col-3 text-grey-8 text-right">{{
          diff.timeX.toFixed(2)
        }}</div>
        <div class="col-2 text-weight-medium text-right">{{ diff.top }}</div>
        <div class="col-3 text-grey-8 text-right">{{
          diff.timeY.toFixed(2)
        }}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">Dev</div>
        <div class="col-2">&nbsp;</div>
        <div class="col-3 text-right text-weight-medium">{{
          diff.devX.toFixed(2)
        }}</div>
        <div class="col-2">&nbsp;</div>
        <div class="col-3 text-right text-weight-medium">{{
          diff.devY.toFixed(2)
        }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { scroll as scrollUtil } from 'quasar'
import { computed, ref } from 'vue'

const { animVerticalScrollTo, animHorizontalScrollTo } = scrollUtil

const scrollableEl = ref(null)

const duration = ref(2000)
const from = ref({ left: 0, top: 0, timeX: 0, timeY: 0, duration: 2000 })
const to = ref({ left: 0, top: 0, timeX: 0, timeY: 0 })

const diff = computed(() => ({
  left: to.value.left - from.value.left,
  top: to.value.top - from.value.top,
  timeX: to.value.timeX - from.value.timeX,
  timeY: to.value.timeY - from.value.timeY,
  devX:
    ((to.value.timeX - from.value.timeX - from.value.duration) /
      from.value.duration) *
    100,
  devY:
    ((to.value.timeY - from.value.timeY - from.value.duration) /
      from.value.duration) *
    100
}))

function scroll() {
  const el = scrollableEl.value
  const timeStart = performance.now()

  from.value = {
    left: Math.round(el.scrollLeft),
    top: Math.round(el.scrollTop),
    timeX: timeStart,
    timeY: timeStart,
    duration: duration.value
  }

  to.value = {
    left: Math.round((el.scrollWidth - el.clientWidth) * Math.random()),
    top: Math.round((el.scrollHeight - el.clientHeight) * Math.random()),
    timeX: timeStart,
    timeY: timeStart
  }

  let { left, top } = from.value
  const fn = e => {
    const time = performance.now()

    if (el.scrollLeft !== left) {
      to.value.timeX = time
      left = el.scrollLeft
    }
    if (el.scrollTop !== top) {
      to.value.timeY = time
      top = el.scrollTop
    }
  }
  el.addEventListener('scroll', fn, { passive: true })
  setTimeout(() => {
    el.removeEventListener('scroll', fn, { passive: true })
  }, duration.value + 500)

  animHorizontalScrollTo(el, to.value.left, duration.value)
  animVerticalScrollTo(el, to.value.top, duration.value)
}
</script>

<style lang="sass">
.animation-scroll-test
  height: 10000px
  width: 10000px
  background: linear-gradient(-90deg, rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(-90deg, rgba(0, 0, 0, .04) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px), linear-gradient(-90deg, #aaa 1px, transparent 1px), linear-gradient(-90deg, transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px), linear-gradient(#aaa 1px, transparent 1px), #f2f2f2 #{"/* rtl:ignore */"}
  background-size: 4px 4px, 4px 4px, 80px 80px, 80px 80px, 80px 80px, 80px 80px, 80px 80px, 80px 80px #{"/* rtl:ignore */"}
</style>
