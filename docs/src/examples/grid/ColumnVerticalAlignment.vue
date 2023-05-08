<template>
  <div class="q-pa-md example-column-vertical-alignment">
    <q-badge>justify-start</q-badge>
    <div class="column justify-start" style="height: 150px">
      <div class="col-4">
        One of two rows
      </div>
      <div class="col-4">
        One of two rows
      </div>
    </div>

    <q-badge>justify-center</q-badge>
    <div class="column justify-center" style="height: 150px">
      <div class="col-4">
        One of two rows
      </div>
      <div class="col-4">
        One of two rows
      </div>
    </div>

    <q-badge>justify-end</q-badge>
    <div class="column justify-end" style="height: 150px">
      <div class="col-4">
        One of two rows
      </div>
      <div class="col-4">
        One of two rows
      </div>
    </div>

    <q-badge>justify-around</q-badge>
    <div class="column justify-around" style="height: 150px">
      <div class="col-4">
        One of two rows
      </div>
      <div class="col-4">
        One of two rows
      </div>
    </div>

    <q-badge>justify-between</q-badge>
    <div class="column justify-between" style="height: 150px">
      <div class="col-4">
        One of two rows
      </div>
      <div class="col-4">
        One of two rows
      </div>
    </div>

    <q-badge>justify-evenly</q-badge>
    <div class="column justify-evenly" style="height: 150px">
      <div class="col-4">
        One of two rows
      </div>
      <div class="col-4">
        One of two rows
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-vertical-alignment
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  > div + div
    margin-top: 1rem
  .column
    background: rgba(#aa0, .1)
</style>
