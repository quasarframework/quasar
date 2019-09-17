
<template>
  <div class="q-pa-md">
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->
    <div class="column" style="height: 150px">
      <div class="col col-md-8">.col .col-md-8</div>
      <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    </div>

    <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
    <div class="column" style="height: 150px">
      <div class="col-4 col-md-6">.col-4 .col-md-6</div>
      <div class="col-4 col-md-6">.col-4 .col-md-6</div>
      <div class="col-4 col-md-6">.col-4 .col-md-6</div>
    </div>

    <!-- Columns are always 50% wide, on mobile and desktop -->
    <div class="column" style="height: 150px">
      <div class="col-6">.col-6</div>
      <div class="col-6">.col-6</div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.column > div
  padding: 10px 15px
  background: rgba(86, 61, 124, .15)
  border: 1px solid rgba(86, 61, 124, .2)
.column + .column
  margin-top: 1rem
</style>
