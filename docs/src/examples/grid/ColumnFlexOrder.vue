<template>
  <div class="q-pa-md example-column-flex-order">

    <div class="column" style="height: 190px">
      <div class="col order-none">
        First, but unordered
        <br>(.order-none)
      </div>
      <div class="col order-last">
        Second, but last
        <br>(.order-last)
      </div>
      <div class="col order-first">
        Third, but first
        <br>(.order-first)
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-column-flex-order
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
