<template>
  <div class="q-pa-md example-row-column-width">

    <div class="row">
      <div class="col">
        .col
      </div>
      <div class="col-6">
        .col-6 (wider)
      </div>
      <div class="col">
        .col
      </div>
    </div>

    <div class="row">
      <div class="col">
        .col
      </div>
      <div class="col-5">
        .col-5 (wider)
      </div>
      <div class="col">
        .col
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-row-column-width
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
