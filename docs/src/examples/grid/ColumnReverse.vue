<template>
  <div class="q-pa-md example-column-reverse">

    <div class="column reverse" style="height: 150px">
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
.example-column-reverse
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
