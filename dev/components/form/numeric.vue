<template>
  <div>
    <div class="layout-padding">

      <p class="caption">Default (no min-max)</p>
      <div style="margin-bottom: 25px">
        <q-numeric v-model="freeNumber"></q-numeric>
      </div>

      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{number}}</em> &nbsp;&nbsp;({{min}}-{{max}})</span>
      </div>

      <p class="caption">Default (with min-max)</p>
      <q-numeric v-model="number" :min="min" :max="max"></q-numeric>

      <p class="caption">With Step 4</p>
      <q-numeric v-model="number" :min="min" :max="max" :step="4"></q-numeric>

      <p class="caption">With Step 0.2 & Maximum decimals 2</p>
      <q-numeric v-model="numberPrecision" :min="min" :max="max" :step="0.2" :max-decimals="2"></q-numeric>

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
      freeNumber: undefined,
      number: 3,
      numberPrecision: 5.2,
      min: 2,
      max: 117
    }
  }
}
</script>
