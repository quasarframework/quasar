<template>
  <div class="q-pa-md example-column-variable-height">

    <div class="column justify-center" style="height: 250px">
      <div class="col col-md-4">
        .col .col-md-4
      </div>
      <div class="col-auto">
        .col-auto (Variable height content)
      </div>
      <div class="col col-md-4">
        .col .col-md-4
      </div>
    </div>

    <div class="column" style="height: 250px">
      <div class="col">
        .col
      </div>
      <div class="col-auto">
        .col-auto (Variable height content)
      </div>
      <div class="col col-md-3">
        .col .col-md-3
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-column-variable-height
  .column
    background: rgba(#aa0, .1)
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
