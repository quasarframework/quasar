<template>
  <div class="q-pa-md example-row-stacked-to-horizontal">

    <div class="row">
      <div class="col-12 col-md-8">.col-12 .col-md-8</div>
      <div class="col-12 col-md-4">.col-12 .col-md-4</div>
    </div>

    <div class="row">
      <div class="col-12 col-md">.col-12 .col-md</div>
      <div class="col-12 col-md">.col-12 .col-md</div>
      <div class="col-12 col-md">.col-12 .col-md</div>
    </div>

  </div>
</template>

<style lang="sass">
.example-row-stacked-to-horizontal
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
