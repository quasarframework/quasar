<template>
  <div class="q-pa-md example-column-horizontal-alignment">
    <q-badge>items-start</q-badge>
    <div class="column items-start" style="height: 150px">
      <div class="col">
        One of three rows
      </div>
      <div class="col">
        One of three rows
      </div>
      <div class="col">
        One of three rows
      </div>
    </div>

    <q-badge>items-center</q-badge>
    <div class="column items-center" style="height: 150px">
      <div class="col">
        One of three rows
      </div>
      <div class="col">
        One of three rows
      </div>
      <div class="col">
        One of three rows
      </div>
    </div>

    <q-badge>items-end</q-badge>
    <div class="column items-end" style="height: 150px">
      <div class="col">
        One of three rows
      </div>
      <div class="col">
        One of three rows
      </div>
      <div class="col">
        One of three rows
      </div>
    </div>

    <q-badge>self-*</q-badge>
    <div class="column" style="height: 150px">
      <div class="col self-start">
        .self-start
      </div>
      <div class="col self-center">
        .self-center
      </div>
      <div class="col self-end">
        .self-end
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-horizontal-alignment
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  > div + div
    margin-top: 1rem
  .column
    background: rgba(#aa0, .1)
</style>
