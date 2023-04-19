<template>
  <div class="q-pa-md example-row-variable-width">

    <div class="row justify-center">
      <div class="col-12 col-md-2">
        .col-12 .col-md-2
      </div>
      <div class="col-12 col-md-auto">
        .col-12 .col-md-auto (Variable width content)
      </div>
      <div class="col-12 col-md-2">
        .col-12 .col-md-2
      </div>
    </div>

    <div class="row">
      <div class="col">
        .col
      </div>
      <div class="col-12 col-md-auto">
        .col-12 .col-md-auto (Variable width content)
      </div>
      <div class="col">
        .col
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-row-variable-width
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
