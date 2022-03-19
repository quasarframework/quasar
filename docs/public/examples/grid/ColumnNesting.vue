<template>
  <div class="q-pa-md">

    <div class="column" style="height: 200px">
      <div class="col-auto">.col-auto</div>
      <div class="col column">
        <div class="col-8 col-sm-6">
          .col-8 .col-sm-6
        </div>
        <div class="col-4 col-sm-6">
          .col-4 .col-sm-6
        </div>
      </div>
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
