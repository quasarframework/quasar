<template>
  <div ref="scrollableEl" class="absolute-full scroll text-dark">
    <div class="animation-scroll-test" />

    <div class="fixed-top-left q-ma-lg q-pa-sm rounded-borders column" style="background: rgba(200, 200, 200, .4)">
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

    <div class="fixed-bottom-left q-ma-lg q-pa-sm rounded-borders column text-no-wrap" style="width: 320px; background: rgba(200, 200, 200, .4)">
      <div class="row no-wrap">
        <div class="col-2">&nbsp;</div>
        <div class="col-2 text-right text-weight-medium">Left</div>
        <div class="col-3 text-right text-weight-medium">Time X</div>
        <div class="col-2 text-right text-weight-medium">Top</div>
        <div class="col-3 text-right text-weight-medium">Time Y</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">From</div>
        <div class="col-2 text-grey-8 text-right">{{from.left}}</div>
        <div class="col-3 text-grey-8 text-right">{{from.timeX.toFixed(2).slice(-8)}}</div>
        <div class="col-2 text-grey-8 text-right">{{from.top}}</div>
        <div class="col-3 text-grey-8 text-right">{{from.timeY.toFixed(2).slice(-8)}}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">To</div>
        <div class="col-2 text-grey-8 text-right">{{to.left}}</div>
        <div class="col-3 text-grey-8 text-right">{{to.timeX.toFixed(2).slice(-8)}}</div>
        <div class="col-2 text-grey-8 text-right">{{to.top}}</div>
        <div class="col-3 text-grey-8 text-right">{{to.timeY.toFixed(2).slice(-8)}}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">Diff</div>
        <div class="col-2 text-weight-medium text-right">{{diff.left}}</div>
        <div class="col-3 text-grey-8 text-right">{{diff.timeX.toFixed(2)}}</div>
        <div class="col-2 text-weight-medium text-right">{{diff.top}}</div>
        <div class="col-3 text-grey-8 text-right">{{diff.timeY.toFixed(2)}}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2 text-weight-medium">Dev</div>
        <div class="col-2">&nbsp;</div>
        <div class="col-3 text-right text-weight-medium">{{diff.devX.toFixed(2)}}</div>
        <div class="col-2">&nbsp;</div>
        <div class="col-3 text-right text-weight-medium">{{diff.devY.toFixed(2)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { scroll } from 'quasar'

const { animScrollTo, animHorizontalScrollTo } = scroll

export default {
  data () {
    return {
      duration: 2000,
      from: { left: 0, top: 0, timeX: 0, timeY: 0, duration: 2000 },
      to: { left: 0, top: 0, timeX: 0, timeY: 0 }
    }
  },

  computed: {
    diff () {
      return {
        left: this.to.left - this.from.left,
        top: this.to.top - this.from.top,
        timeX: this.to.timeX - this.from.timeX,
        timeY: this.to.timeY - this.from.timeY,
        devX: (this.to.timeX - this.from.timeX - this.from.duration) / this.from.duration * 100,
        devY: (this.to.timeY - this.from.timeY - this.from.duration) / this.from.duration * 100
      }
    }
  },

  methods: {
    scroll () {
      const el = this.$refs.scrollableEl
      const timeStart = performance.now()

      this.from = {
        left: Math.round(el.scrollLeft),
        top: Math.round(el.scrollTop),
        timeX: timeStart,
        timeY: timeStart,
        duration: this.duration
      }

      this.to = {
        left: Math.round((el.scrollWidth - el.clientWidth) * Math.random()),
        top: Math.round((el.scrollHeight - el.clientHeight) * Math.random()),
        timeX: timeStart,
        timeY: timeStart
      }

      let { left, top } = this.from
      const fn = e => {
        const time = performance.now()

        if (el.scrollLeft !== left) {
          this.to.timeX = time
          left = el.scrollLeft
        }
        if (el.scrollTop !== top) {
          this.to.timeY = time
          top = el.scrollTop
        }
      }
      el.addEventListener('scroll', fn, { passive: true })
      setTimeout(() => {
        el.removeEventListener('scroll', fn, { passive: true })
      }, this.duration + 500)

      animHorizontalScrollTo(el, this.to.left, this.duration)
      animScrollTo(el, this.to.top, this.duration)
    }
  }
}
</script>

<style lang="sass">
.animation-scroll-test
  height: 10000px
  width: 10000px
  background: linear-gradient(-90deg, rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(-90deg, rgba(0, 0, 0, .04) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px), linear-gradient(-90deg, #aaa 1px, transparent 1px), linear-gradient(-90deg, transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px), linear-gradient(#aaa 1px, transparent 1px), #f2f2f2 #{"/* rtl:ignore */"}
  background-size: 4px 4px, 4px 4px, 80px 80px, 80px 80px, 80px 80px, 80px 80px, 80px 80px, 80px 80px #{"/* rtl:ignore */"}
</style>
