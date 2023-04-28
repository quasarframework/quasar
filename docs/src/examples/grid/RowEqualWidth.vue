<template>
  <div class="q-pa-md example-row-equal-width">

    <div class="row">
      <div class="col">
        .col
      </div>
      <div class="col">
        .col
      </div>
    </div>

    <div class="row">
      <div class="col">
        .col
      </div>
      <div class="col">
        .col
      </div>
      <div class="col">
        .col
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-row-equal-width
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
