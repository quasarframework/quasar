<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ model.min }} to {{ model.max }} ({{ range.min }} to {{ range.max }}, step {{ range.step }})
    </q-badge>

    <q-range
      :style="trackStyle"
      class="custom-colored-range custom-colored-range--inside"
      v-model="model"
      :min="range.min"
      :max="range.max"
      :step="range.step"
      :left-label-value="model.min + 'px'"
      :right-label-value="model.max + 'px'"
      :left-label-color="leftLabelColor"
      :right-label-color="rightLabelColor"
      label-always
      drag-range
      color="purple"
    />

    <q-range
      :style="trackStyle"
      class="custom-colored-range custom-colored-range--outside q-mt-lg"
      v-model="model"
      :min="range.min"
      :max="range.max"
      :step="range.step"
      :left-label-value="model.min + 'px'"
      :right-label-value="model.max + 'px'"
      :left-label-color="leftLabelColor"
      :right-label-color="rightLabelColor"
      label-always
      drag-range
      color="purple"
    />

    <q-range
      :style="trackStyleTicks"
      class="custom-colored-range--zoom q-mt-lg"
      v-model="model"
      :min="range.min"
      :max="range.max"
      :step="range.step"
      :left-label-value="model.min + 'px'"
      :right-label-value="model.max + 'px'"
      :left-label-color="leftLabelColor"
      :right-label-color="rightLabelColor"
      label-always
      drag-range
      color="purple"
    />
  </div>
</template>

<style lang="stylus">
.custom-colored-range
  .q-slider__track-container--h
    background-image: var(--track-bg)
    margin-top: -3px
    height: 6px

.custom-colored-range--inside
  .q-slider__track--h
    top: 2px
    bottom: 2px

.custom-colored-range--outside
  .q-slider__track--h
    border: 2px solid currentColor
    background: transparent

.custom-colored-range--zoom
  .q-slider__track-container--h
    background: linear-gradient(to right, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.26) 100%),
      var(--track-bg),
      var(--tick-bg)
    background-repeat: no-repeat
    background-position: 0 9px, 0 9px, var(--tick-bg-pos)
    background-size: 100% 2px, 100% 2px, var(--tick-bg-size)
    background-blend-mode: soft-light
    margin-top: -10px
    height: 20px
    overflow: visible !important
  .q-slider__track--h
    top: 9px
    bottom: 9px
    border: 1px solid currentColor
    border-radius: 10px
    background: transparent
    transition: width 0.28s, left 0.28s, right 0.28s, top .28s, bottom .28s, border-width .28s
  &.q-slider--active
    .q-slider__track--h
      top: 5px
      bottom: 5px
      border-width: 3px
      transition: top .28s, bottom .28s, border-width .28s
</style>

<script>
export default {
  data () {
    return {
      range: {
        min: -20,
        max: 20,
        step: 1
      },
      model: {
        min: -12,
        max: 9
      },
      // min and max in the unit of the value
      zones: [
        { color: 'red', min: -20, max: -10 },
        { color: 'orange', min: -5, max: 2 },
        { color: 'green', min: 8, max: 20 }
      ],
      // x in the unit of the value
      // y from top in px - tick is centered if y is not specified
      // width and height in px
      ticks: [
        { color: 'black', x: -10, width: 4, height: 20 },
        { color: 'green', x: -5, width: 12, height: 10 },
        { color: 'blue', x: 0, y: 0, width: 2, height: 9 },
        { color: 'orange', x: 10, y: 11, width: 8, height: 9 }
      ]
    }
  },

  computed: {
    leftLabelColor () {
      return this.getLabelColor(this.model.min)
    },

    rightLabelColor () {
      return this.getLabelColor(this.model.max)
    },

    trackStyle () {
      const colors = []
      const { min, max } = this.range
      const range = max - min

      let prev = min

      for (let i = 0; i < this.zones.length; i++) {
        const zone = this.zones[i]

        if (zone.min > prev) {
          colors.push(`transparent ${(prev - min) / range * 100}%`)
          colors.push(`transparent ${(zone.min - min) / range * 100}%`)
        }

        colors.push(`${zone.color} ${(zone.min - min) / range * 100}%`)
        colors.push(`${zone.color} ${(zone.max - min) / range * 100}%`)

        prev = zone.max
      }

      if (prev < max) {
        colors.push(`transparent ${(prev - min) / range * 100}%`)
        colors.push(`transparent ${(max - min) / range * 100}%`)
      }

      return {
        '--track-bg': `linear-gradient(to right,${colors.join(',')})`
      }
    },

    tickStyle () {
      const ticksBg = []
      const ticksBgPos = []
      const ticksBgSize = []
      const { min, max } = this.range
      const rangeX = max - min
      const rangeY = 20 // from CSS

      for (let i = 0; i < this.ticks.length; i++) {
        const tick = this.ticks[i]

        ticksBg.push(`linear-gradient(to right,${tick.color} 0,${tick.color} 100%)`)
        ticksBgPos.push(`${(tick.x - min) / rangeX * 100}% ${tick.y === void 0 ? (rangeY - tick.height) / 2 : tick.y}px`)
        ticksBgSize.push(`${tick.width}px ${tick.height}px`)
      }

      return {
        '--tick-bg': ticksBg.join(','),
        '--tick-bg-pos': ticksBgPos.join(','),
        '--tick-bg-size': ticksBgSize.join(',')
      }
    },

    trackStyleTicks () {
      return {
        ...this.trackStyle,
        ...this.tickStyle
      }
    }
  },

  methods: {
    getLabelColor (val) {
      const zone = this.zones.find(z => (z.min <= val && val <= z.max))

      if (zone !== void 0) {
        return zone.color
      }
    }
  }
}
</script>
