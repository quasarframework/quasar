<template>
  <div class="q-pa-md example-row-reverse">

    <div class="row reverse">
      <div class="col">
        First, but last
      </div>
      <div class="col">
        Second, unchanged
      </div>
      <div class="col">
        Third, but first
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-row-reverse
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
