<template>
  <div class="q-pa-md">

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

<style lang="sass" scoped>
.column
  background: rgba(61,89,124, .15)
.column > div
  padding: 10px 15px
  background: rgba(61,89,124, .20)
  border: 1px solid rgba(126,135,149, .6)
.column + .column
  margin-top: 1rem
</style>
