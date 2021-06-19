<template>
  <div class="column no-wrap" style="height: 100vh" :class="dark ? 'bg-black text-white' : ''">
    <div class="row q-col-gutter-md q-pl-md q-pr-xl shadow-2" :class="dark ? 'bg-grey-8' : 'bg-grey-2'" style="z-index: 1">
      <q-toggle v-model="dark" :dark="dark" label="Dark" :false-value="null" />
      <q-toggle v-model="dense" :dark="dark" label="Dense" />
      <q-toggle v-model="vertical" :dark="dark" label="Vertical" />
      <q-toggle v-model="defaultLabels" :dark="dark" label="Default labels" />
      <q-input borderless square class="col" v-model="labelLeftTemplate" :dark="dark" label="Left label template - use {model}" />
      <q-input borderless square class="col" v-model="labelRightTemplate" :dark="dark" label="Right label template - use {model}" />
    </div>

    <div class="col scroll q-pl-md q-pr-xl q-gutter-y-lg">
      <p class="caption">
        Standalone
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ standalone.min }} to {{ standalone.max }}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>

      <div class="row justify-around">
        <q-range :vertical="vertical" :dark="dark" :dense="dense" @change="onChange" @update:model-value="onInput" v-model="standalone" :min="0" :max="50" />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" @change="val => { standalone = val; onChange(val); }" @update:model-value="onInput" :model-value="standalone" :min="0" :max="50" label :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="standalone" label-color="orange" label-text-color="black" :min="0" :max="50" label :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" />
      </div>

      <p class="caption">
        Reverse
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ stepZero.min }} to {{ stepZero.max }}</em> &nbsp;&nbsp;(0 to 100)</span>
        </span>
      </p>
      <q-range :vertical="vertical" reverse :dark="dark" :dense="dense" v-model="stepZero" :step="0" label :left-label-value="labelLeftValue(stepZero.min)" :right-label-value="labelRightValue(stepZero.max)" />

      <p class="caption">
        Step 0
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ stepZero.min }} to {{ stepZero.max }}</em> &nbsp;&nbsp;(0 to 100)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="stepZero" :step="0" />

      <p class="caption">
        With Floating Point Precision
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ precision }}</em> &nbsp;&nbsp;(0.1 to 2.0, step 0.01) - decimals set to 1</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="precision" :min="0.1" :max="2" :step="0.01" />

      <p class="caption">
        With Floating Point Precision
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ precision }}</em> &nbsp;&nbsp;(0.1 to 2.0, step 0.01) - decimals not set (auto 2)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="precision" :min="0.1" :max="2" :step="0.01" />

      <p class="caption">
        With Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ label.min }} to {{ label.max }}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="label" :min="-20" :max="20" :step="4" label :left-label-value="labelLeftValue(label.min)" :right-label-value="labelRightValue(label.max)" />

      <p class="caption">
        With Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ step.min }} to {{ step.max }}</em> &nbsp;&nbsp;(0 to 45, step 5)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="step" :min="0" :max="45" :step="5" label :left-label-value="labelLeftValue(step.min)" :right-label-value="labelRightValue(step.max)" />

      <p class="caption">
        Snap to Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ snap.min }} to {{ snap.max }}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="snap" :min="0" :max="10" :step="2" label :left-label-value="labelLeftValue(snap.min)" :right-label-value="labelRightValue(snap.max)" snap />

      <p class="caption">
        With Markers + Snap to Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ marker.min }} to {{ marker.max }}</em> &nbsp;&nbsp;(-6 to 10, step 2)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="marker" :min="-6" :max="10" :step="2" label :left-label-value="labelLeftValue(marker.min)" :right-label-value="labelRightValue(marker.max)" snap markers />

      <p class="caption">
        Display Label Always
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ label.min }} to {{ label.max }}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="label" :min="-20" :max="20" :step="4" label-always :left-label-value="labelLeftValue(label.min)" :right-label-value="labelRightValue(label.max)" />

      <p class="caption">
        With custom values for labels
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ label.min }} to {{ label.max }}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="label" :min="-20" :max="20" :step="4" label-always :left-label-value="`${label.min}px`" :right-label-value="`${label.max} px test`" />

      <p class="caption">
        Drag Range
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ range.min }} to {{ range.max }}</em> &nbsp;&nbsp;(0 to 100, step 1)</span>
        </span>
      </p>

      <div class="row justify-around">
        <q-range :vertical="vertical" :dark="dark" :dense="dense" @change="onChange" @update:model-value="onInput" v-model="range" :min="0" :max="100" label :left-label-value="labelLeftValue(range.min)" :right-label-value="labelRightValue(range.max)" drag-range />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" @change="val => { range = val; onChange(val); }" @update:model-value="onInput" :model-value="range" :min="0" :max="100" label :left-label-value="labelLeftValue(range.min)" :right-label-value="labelRightValue(range.max)" drag-range />
      </div>

      <p class="caption">
        Drag Range + Snap to Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ rangeSnap.min }} to {{ rangeSnap.max }}</em> &nbsp;&nbsp;(0 to 100, step 5)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="rangeSnap" :min="0" :max="100" :step="5" drag-range label :left-label-value="labelLeftValue(rangeSnap.min)" :right-label-value="labelRightValue(rangeSnap.max)" markers snap />

      <p class="caption">
        Drag Only Range (Fixed Interval)
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ onlyRange.min }} to {{ onlyRange.max }}</em> &nbsp;&nbsp;(0 to 100, step 5)</span>
        </span>
      </p>

      <div class="row justify-around">
        <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="onlyRange" :min="0" :max="100" :step="5" drag-only-range label :left-label-value="labelLeftValue(onlyRange.min)" :right-label-value="labelRightValue(onlyRange.max)" />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" :model-value="onlyRange" @change="val => { onlyRange = val }" :min="0" :max="100" :step="5" drag-only-range label :left-label-value="labelLeftValue(onlyRange.min)" :right-label-value="labelRightValue(onlyRange.max)" />
      </div>

      <p class="caption">
        Readonly State
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" readonly label />

      <p class="caption">
        Disabled State
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" disable label />

      <p class="caption">
        Null Min Value
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ getNullLabel(nullMin.min) }} to {{ nullMin.max }}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="nullMin" :min="0" :max="50" />

      <p class="caption">
        Null Max Value
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ nullMax.min }} to {{ getNullLabel(nullMax.max) }}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="nullMax" :min="0" :max="50" />

      <p class="caption">
        Null Min and Max Values
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ getNullLabel(nullMinMax.min) }} to {{ getNullLabel(nullMinMax.max) }}</em> &nbsp;&nbsp;(20 to 50)</span>
        </span>
      </p>
      <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="nullMinMax" :min="20" :max="50" />

      <p class="caption">
        Coloring
      </p>

      <div class="row justify-around">
        <q-range :vertical="vertical" :dark="dark" :dense="dense" color="secondary" v-model="standalone" :min="0" :max="50" label :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" color="orange" v-model="standalone" :min="0" :max="50" label :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" color="dark" v-model="standalone" :min="0" :max="50" label :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" />
        <q-range :vertical="vertical" :dark="dark" :dense="dense" color="purple" left-label-color="deep-orange" right-label-color="black" v-model="standalone" :min="0" :max="50" label-always :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" class="q-mt-md" />
      </div>

      <p class="caption">
        Inside of a List
      </p>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="local_atm" />
          </q-item-section>
          <q-item-section>
            <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" label :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon name="euro_symbol" />
          </q-item-section>
          <q-item-section>
            <q-range :vertical="vertical" :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" label :left-label-value="labelLeftValue(standalone.min)" :right-label-value="labelRightValue(standalone.max)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: null,
      dense: false,
      vertical: false,

      defaultLabels: true,
      labelLeftTemplate: 'Current left value: {model}',
      labelRightTemplate: 'Current right value: {model}',

      nullMin: {
        min: null,
        max: 20
      },

      nullMax: {
        min: 20,
        max: null
      },

      nullMinMax: {
        min: null,
        max: null
      },

      standalone: {
        min: 10,
        max: 35
      },

      stepZero: {
        min: 34.05,
        max: 64.023
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
  computed: {
    labelLeftValue () {
      return this.defaultLabels === true
        ? () => void 0
        : model => this.labelLeftTemplate.split('{model}').join(model)
    },

    labelRightValue () {
      return this.defaultLabels === true
        ? () => void 0
        : model => this.labelRightTemplate.split('{model}').join(model)
    }
  },
  watch: {
    'standalone.min' (val, old) {
      console.log(`Changed [min] from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    },
    'standalone.max' (val, old) {
      console.log(`Changed [max] from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    },
    'range.min' (val, old) {
      console.log(`Changed [min] from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    },
    'range.max' (val, old) {
      console.log(`Changed [max] from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@update:model-value', JSON.stringify(val))
    },
    getNullLabel (val) {
      return val === null ? 'null' : val
    }
  }
}
</script>
