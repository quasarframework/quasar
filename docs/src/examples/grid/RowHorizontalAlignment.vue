<template>
  <div class="q-pa-md example-row-horizontal-alignment">
    <q-badge>justify-start</q-badge>
    <div class="row justify-start">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-center</q-badge>
    <div class="row justify-center">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-end</q-badge>
    <div class="row justify-end">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-around</q-badge>
    <div class="row justify-around">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-between</q-badge>
    <div class="row justify-between">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-evenly</q-badge>
    <div class="row justify-evenly">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-horizontal-alignment
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  > div + div
    margin-top: 1rem
</style>
