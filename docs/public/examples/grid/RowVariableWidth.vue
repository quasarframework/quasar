<template>
  <div class="q-pa-md">

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

<style lang="sass" scoped>
.row
  background: rgba(61,89,124, .15)
.row > div
  padding: 10px 15px
  background: rgba(61,89,124, .20)
  border: 1px solid rgba(126,135,149, .6)
.row + .row
  margin-top: 1rem
</style>
