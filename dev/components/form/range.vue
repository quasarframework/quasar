<template>
  <div>
    <div class="layout-padding">

      <p class="caption">
        Standalone
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{standalone.min}} to {{standalone.max}}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <q-range @change="onChange" @input="onInput" v-model="standalone" :min="0" :max="50"></q-range>
      <q-range @change="val => { standalone = val; onChange(val); }" @input="onInput" :value="standalone" :min="0" :max="50" label></q-range>
      <q-range v-model="standalone" :min="0" :max="50" square></q-range>

      <p class="caption">
        With Floating Point Precision
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{precision}}</em> &nbsp;&nbsp;(0.1 to 1.0)</span>
        </span>
      </p>
      <q-range v-model="precision" :min="0.1" :max="1.0" :step="0.1" :decimals="1"></q-range>

       <p class="caption">
        With Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label.min}} to {{label.max}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range v-model="label" :min="-20" :max="20" :step="4" label></q-range>

      <p class="caption">
        With Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{step.min}} to {{step.max}}</em> &nbsp;&nbsp;(0 to 45, step 5)</span>
        </span>
      </p>
      <q-range v-model="step" :min="0" :max="45" :step="5" label></q-range>

      <p class="caption">
        Snap to Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{snap.min}} to {{snap.max}}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-range v-model="snap" :min="0" :max="10" :step="2" label snap></q-range>

      <p class="caption">
        With Markers + Snap to Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{marker.min}} to {{marker.max}}</em> &nbsp;&nbsp;(-6 to 10, step 2)</span>
        </span>
      </p>
      <q-range v-model="marker" :min="-6" :max="10" :step="2" label snap markers></q-range>

      <p class="caption">
        Display Label Always
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label.min}} to {{label.max}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range v-model="label" :min="-20" :max="20" :step="4" label-always></q-range>

      <p class="caption">
        With custom values for labels
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label.min}} to {{label.max}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range v-model="label" :min="-20" :max="20" :step="4" label-always :left-label-value="`${label.min}px`" :right-label-value="`${label.max}px`"></q-range>

      <p class="caption">
        Drag Range
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{range.min}} to {{range.max}}</em> &nbsp;&nbsp;(0 to 100, step 1)</span>
        </span>
      </p>
      <q-range @change="onChange" @input="onInput" v-model="range" :min="0" :max="100" label drag-range></q-range>
      <q-range @change="val => { range = val; onChange(val); }" @input="onInput" :value="range" :min="0" :max="100" label drag-range></q-range>

      <p class="caption">
        Drag Range + Snap to Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{rangeSnap.min}} to {{rangeSnap.max}}</em> &nbsp;&nbsp;(0 to 100, step 5)</span>
        </span>
      </p>
      <q-range v-model="rangeSnap" :min="0" :max="100" :step="5" drag-range label markers snap></q-range>

      <p class="caption">
        Drag Only Range (Fixed Interval)
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{onlyRange.min}} to {{onlyRange.max}}</em> &nbsp;&nbsp;(0 to 100, step 5)</span>
        </span>
      </p>
      <q-range v-model="onlyRange" :min="0" :max="100" :step="5" drag-only-range label></q-range>

      <p class="caption">Disabled State</p>
      <q-range v-model="standalone" :min="0" :max="50" disable></q-range>

      <p class="caption">Error State</p>
      <q-range error v-model="standalone" :min="0" :max="50"></q-range>
      <q-range error label-always v-model="standalone" :min="0" :max="50" left-label-color="secondary" right-label-color="grey-8"></q-range>

      <p class="caption">Coloring</p>
      <q-range color="secondary" v-model="standalone" :min="0" :max="50" label></q-range>
      <q-range color="orange" v-model="standalone" :min="0" :max="50" label></q-range>
      <q-range color="dark" v-model="standalone" :min="0" :max="50" label></q-range>

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-item>
          <q-item-side icon="local_atm" />
          <q-item-main>
            <q-range v-model="standalone" :min="0" :max="50" label />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="euro symbol" />
          <q-item-main>
            <q-range v-model="standalone" :min="0" :max="50" label />
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
      standalone: {
        min: 10,
        max: 35
      },

      precision: {
        min: 0.2,
        max: 0.7
      },

      step: {
        min: 10,
        max: 20
      },

      label: {
        min: -12,
        max: 8
      },

      snap: {
        min: 2,
        max: 6
      },

      marker: {
        min: 6,
        max: 8
      },

      range: {
        min: 20,
        max: 65
      },

      rangeSnap: {
        min: 35,
        max: 60
      },

      onlyRange: {
        min: 10,
        max: 35
      }
    }
  },
  watch: {
    'standalone.min' (val, old) {
      console.log(`Changed [min] from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    'standalone.max' (val, old) {
      console.log(`Changed [max] from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    'range.min' (val, old) {
      console.log(`Changed [min] from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    'range.max' (val, old) {
      console.log(`Changed [max] from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
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
