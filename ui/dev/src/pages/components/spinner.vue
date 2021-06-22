<template>
  <div>
    <div class="q-layout-padding">
      <div class="q-mt-md">
        <q-slider label label-always :label-value="size + 'px'" v-model="size" :min="20" :max="256" />
      </div>

      <div class="row no-wrap q-col-gutter-md">
        <q-input
          v-model="color"
          dense
          outlined
          class="col"
          float-label
          label="Color Palette"
        />
        <q-select
          class="col"
          dense
          outlined
          emit-value
          v-model="color"
          float-label
          label="Quick Pick"
          :options="colorOptions"
        />
      </div>

      <h6>
        Hover over them to see their names
      </h6>

      <div style="margin-top: 20px">
        <div v-for="spinner in spinners" :key="spinner" class="inline-block q-ma-xs">
          <component
            :is="`q-spinner-${spinner}`"
            :size="size"
            :color="color"
          />
          <q-tooltip :offset="[0, 8]">
            {{ spinner }}
          </q-tooltip>
        </div>
      </div>

      <h6>
        Default Spinner:
        <q-spinner :color="color" :size="size" style="margin-left: 1rem;" />
        <q-spinner :color="color" :size="size" style="margin-left: 1rem;" />
      </h6>

      <q-spinner-gears :color="color" />
      <h6>
        <q-spinner-gears :color="color" size="md" />
        <q-spinner-gears :color="color" size="xl" />
      </h6>
    </div>
  </div>
</template>

<script>
import {
  QSpinner, QSpinnerAudio, QSpinnerBall, QSpinnerBars, QSpinnerBox, QSpinnerClock,
  QSpinnerComment, QSpinnerCube, QSpinnerDots, QSpinnerFacebook, QSpinnerGears,
  QSpinnerGrid, QSpinnerHearts, QSpinnerHourglass, QSpinnerInfinity, QSpinnerIos,
  QSpinnerOrbit, QSpinnerOval, QSpinnerPie, QSpinnerPuff, QSpinnerRadio, QSpinnerRings,
  QSpinnerTail
} from 'quasar'

export default {
  components: {
    QSpinner, QSpinnerAudio, QSpinnerBall, QSpinnerBars, QSpinnerBox, QSpinnerClock, // eslint-disable-line
    QSpinnerComment, QSpinnerCube, QSpinnerDots, QSpinnerFacebook, QSpinnerGears, // eslint-disable-line
    QSpinnerGrid, QSpinnerHearts, QSpinnerHourglass, QSpinnerInfinity, QSpinnerIos, // eslint-disable-line
    QSpinnerOrbit, QSpinnerOval, QSpinnerPie, QSpinnerPuff, QSpinnerRadio, QSpinnerRings, // eslint-disable-line
    QSpinnerTail
  },

  data () {
    return {
      size: 36,
      color: 'primary',
      spinners: [
        'audio', 'ball', 'bars', 'box', 'clock', 'comment',
        'cube', 'dots', 'facebook', 'gears', 'grid', 'hearts',
        'hourglass', 'infinity', 'ios', 'orbit', 'oval',
        'pie', 'puff', 'radio', 'rings', 'tail'
      ],
      colorOptions: [
        {
          label: 'Black',
          color: 'black',
          value: 'black'
        },
        {
          label: 'Primary',
          color: 'primary',
          value: 'primary'
        },
        {
          label: 'Secondary',
          color: 'secondary',
          value: 'secondary'
        },
        {
          label: 'Red',
          color: 'red',
          value: 'red'
        },
        {
          label: 'Green',
          color: 'green',
          value: 'green'
        },
        {
          label: 'Blue',
          color: 'blue',
          value: 'blue'
        }
      ]
    }
  }
}
</script>
