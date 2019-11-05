<template>
  <div class="q-pa-md">

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

<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  background: rgba(86,61,124,.15)
  border: 1px solid rgba(86,61,124,.2)
</style>
