<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Standalone
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{standalone}}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <q-slider @change="onChange" @input="onInput" v-model="standalone" :min="0" :max="50"></q-slider>
      <q-slider @change="val => { standalone = val; onChange(val); }" @input="onInput" :value="standalone" :min="0" :max="50" label></q-slider>
      <q-slider v-model="standalone" :min="0" :max="50" square></q-slider>

      <p class="caption">
        With Floating Point Precision
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{precision}}</em> &nbsp;&nbsp;(0.1 to 1.0)</span>
        </span>
      </p>
      <q-slider v-model="precision" :min="0.1" :max="1" :step="0.1" :decimals="1"></q-slider>

      <p class="caption">
        With Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{step}}</em> &nbsp;&nbsp;(0 to 45, step 5)</span>
        </span>
      </p>
      <q-slider v-model="step" :min="0" :max="45" :step="5"></q-slider>

      <p class="caption">
        With Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label}}</em> &nbsp;&nbsp;(-10 to 10, step 4)</span>
        </span>
      </p>
      <q-slider v-model="label" :min="-10" :max="10" :step="4" label></q-slider>

      <p class="caption">
        Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{snap}}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-slider v-model="snap" :min="0" :max="10" :step="2" label snap></q-slider>

      <p class="caption">
        With Markers. Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{marker}}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-slider v-model="marker" :min="0" :max="10" :step="2" label snap markers></q-slider>

      <p class="caption">
        Display Label Always
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-slider v-model="label" :min="-20" :max="20" :step="4" label-always></q-slider>

      <p class="caption">
        With custom value for Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-slider v-model="label" :min="-20" :max="20" :step="4" label :label-value="`${label}px`" label-always />

      <p class="caption">Disabled State</p>
      <q-slider v-model="standalone" :min="0" :max="50" disable></q-slider>

      <p class="caption">Error State</p>
      <q-slider error v-model="standalone" :min="0" :max="50"></q-slider>
      <q-slider error color="amber" v-model="standalone" :min="0" :max="50" label-always></q-slider>

      <p class="caption">Coloring</p>
      <q-slider color="secondary" v-model="standalone" :min="0" :max="50" label></q-slider>
      <q-slider color="orange" v-model="standalone" :min="0" :max="50" label></q-slider>
      <q-slider color="dark" v-model="standalone" :min="0" :max="50" label></q-slider>

      <q-field
        label="Range label"
        icon="cloud"
      >
        <q-slider class="dark" v-model="standalone" :min="0" :max="50" label></q-slider>
      </q-field>

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-item>
          <q-item-side icon="volume_up" />
          <q-item-main>
            <q-slider v-model="standalone" :min="0" :max="50" label />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="brightness_medium" />
          <q-item-main>
            <q-slider v-model="standalone" :min="0" :max="50" label />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="mic" />
          <q-item-main>
            <q-slider v-model="standalone" :min="0" :max="50" label />
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      standalone: 20,
      precision: 0.4,
      step: 30,
      label: 5,
      snap: 2,
      marker: 6
    }
  },
  watch: {
    standalone (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    step (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
