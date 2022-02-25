<template>
  <div class="q-pa-md">

    <div class="row">
      <div class="col">.col</div>
      <div class="col">.col</div>
      <div class="col">.col</div>
      <div class="col">.col</div>
    </div>

    <div class="row">
      <div class="col-8">.col-8</div>
      <div class="col-4">.col-4</div>
    </div>

  </div>
</template>

<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  background: rgba(61,89,124, .15)
  border: 1px solid rgba(126,135,149, .6)
.row + .row
  margin-top: 1rem
</style>
