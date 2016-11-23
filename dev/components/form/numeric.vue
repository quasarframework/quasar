<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{number}}</em> &nbsp;&nbsp;({{min}}-{{max}})</span>
      </div>

      <p class="caption">Standalone</p>
      <q-numeric v-model="number" :min="min" :max="max"></q-numeric>

      <p class="caption">Disabled State</p>
      <q-numeric v-model="number" :min="min" :max="max" disable></q-numeric>

      <p class="caption">Readonly State</p>
      <q-numeric v-model="number" :min="min" :max="max" readonly></q-numeric>

      <p class="caption">Error State</p>
      <q-numeric class="has-error" v-model="number" :min="min" :max="max"></q-numeric>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <span class="item-label">Number: </span>
            <q-numeric v-model="number" :min="min" :max="max"></q-numeric>
          </div>
        </div>
        <hr class="inset">
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <span class="item-label">Number: </span>
            <q-numeric v-model="number" :min="min" :max="max"></q-numeric>
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
      number: 3,
      min: 1,
      max: 1017
    }
  }
}
</script>
