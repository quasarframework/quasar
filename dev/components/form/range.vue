<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Standalone
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{standalone}}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <q-range v-model="standalone" :min="0" :max="50"></q-range>

      <p class="caption">
        With Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{step}}</em> &nbsp;&nbsp;(0 to 45, step 5)</span>
        </span>
      </p>
      <q-range v-model="step" :min="0" :max="45" :step="5"></q-range>

      <p class="caption">
        With Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range v-model="label" :min="-20" :max="20" :step="4" label></q-range>

      <p class="caption">
        Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{snap}}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-range v-model="snap" :min="0" :max="10" :step="2" label snap></q-range>

      <p class="caption">
        With Markers. Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{marker}}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-range v-model="marker" :min="0" :max="10" :step="2" label snap markers></q-range>

      <p class="caption">
        Display Label Always
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-range v-model="label" :min="-20" :max="20" :step="4" label-always></q-range>

      <p class="caption">Disabled State</p>
      <q-range v-model="standalone" :min="0" :max="50" disable></q-range>

      <p class="caption">Error State</p>
      <q-range class="has-error" v-model="standalone" :min="0" :max="50"></q-range>

      <p class="caption">Coloring</p>
      <q-range class="secondary" v-model="standalone" :min="0" :max="50" label></q-range>
      <q-range class="orange" v-model="standalone" :min="0" :max="50" label></q-range>
      <q-range class="dark" v-model="standalone" :min="0" :max="50" label></q-range>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item two-lines">
          <i class="item-primary">volume_up</i>
          <div class="item-content">
            <q-range v-model="standalone" :min="0" :max="50" label></q-range>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">brightness_medium</i>
          <div class="item-content">
            <q-range v-model="standalone" :min="0" :max="50" label></q-range>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">mic</i>
          <div class="item-content">
            <q-range v-model="standalone" :min="0" :max="50" label></q-range>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      standalone: 20,
      step: 30,
      label: 5,
      snap: 2,
      marker: 6
    }
  }
}
</script>
