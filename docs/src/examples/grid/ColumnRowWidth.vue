<template>
  <div class="q-pa-md example-column-row-width">

    <div class="column" style="height: 150px">
      <div class="col">
        .col
      </div>
      <div class="col-5">
        .col-5
      </div>
      <div class="col">
        .col
      </div>
    </div>

    <div class="column" style="height: 250px">
      <div class="col">
        .col
      </div>
      <div class="col-8">
        .col-8
      </div>
      <div class="col">
        .col
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-column-row-width
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
