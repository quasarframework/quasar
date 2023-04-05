<template>
  <div class="q-pa-md example-column-equal-width">

    <div class="column" style="height: 150px">
      <div class="col">
        1 of 2
      </div>
      <div class="col">
        1 of 2
      </div>
    </div>

    <div class="column" style="height: 150px">
      <div class="col">
        1 of 3
      </div>
      <div class="col">
        1 of 3
      </div>
      <div class="col">
        1 of 3
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-column-equal-width
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
