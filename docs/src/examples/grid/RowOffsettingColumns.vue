<template>
  <div class="q-pa-md">

    <div class="row">
      <div class="col-md-4">.col-md-4</div>
      <div class="col-md-4 offset-md-4">.col-md-4 .offset-md-4</div>
    </div>

    <div class="row">
      <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
      <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
    </div>

    <div class="row">
      <div class="col-md-6 offset-md-3">.col-md-6 .offset-md-3</div>
    </div>

  </div>
</template>

<style lang="sass" scoped>
.row
  background: rgba(255,0,0,.1)
.row > div
  padding: 10px 15px
  background: rgba(86,61,124,.15)
  border: 1px solid rgba(86,61,124,.2)
.row + .row
  margin-top: 1rem
</style>
