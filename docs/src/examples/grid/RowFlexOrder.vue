<template>
  <div class="q-pa-md example-row-flex-order">

    <div class="row">
      <div class="col order-none">
        First, but unordered<br>(.order-none)
      </div>
      <div class="col order-last">
        Second, but last<br>(.order-last)
      </div>
      <div class="col order-first">
        Third, but first<br>(.order-first)
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-row-flex-order
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
