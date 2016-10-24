<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Standalone
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{standalone}}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <quasar-range v-model="standalone" :min="0" :max="50"></quasar-range>

      <p class="caption">
        With Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{step}}</em> &nbsp;&nbsp;(0 to 45, step 5)</span>
        </span>
      </p>
      <quasar-range v-model="step" :min="0" :max="45" :step="5"></quasar-range>

      <p class="caption">
        With Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{label}}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <quasar-range v-model="label" :min="-20" :max="20" :step="4" label></quasar-range>

      <p class="caption">
        Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{snap}}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <quasar-range v-model="snap" :min="0" :max="10" :step="2" label snap></quasar-range>

      <p class="caption">
        With Markers. Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{marker}}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <quasar-range v-model="marker" :min="0" :max="10" :step="2" label snap markers></quasar-range>

      <p class="caption">Disabled State</p>
      <quasar-range v-model="standalone" :min="0" :max="50" disable></quasar-range>

      <p class="caption">Coloring</p>
      <quasar-range class="secondary" v-model="standalone" :min="0" :max="50" label></quasar-range>
      <quasar-range class="orange" v-model="standalone" :min="0" :max="50" label></quasar-range>
      <quasar-range class="dark" v-model="standalone" :min="0" :max="50" label></quasar-range>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item two-lines">
          <i class="item-primary">volume_up</i>
          <div class="item-content">
            <quasar-range v-model="standalone" :min="0" :max="50" label></quasar-range>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">brightness_medium</i>
          <div class="item-content">
            <quasar-range v-model="standalone" :min="0" :max="50" label></quasar-range>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">mic</i>
          <div class="item-content">
            <quasar-range v-model="standalone" :min="0" :max="50" label></quasar-range>
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
