<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-9">.col-9</div>
      <div class="col-4">
        .col-4
        <br />Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.
      </div>
      <div class="col-5">
        .col-5
        <br />Subsequent columns continue along the new line.
      </div>
    </div>

    <div class="row">
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>

      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  background: rgba(61,89,124, .20)
  border: 1px solid rgba(126,135,149, .6)
.row + .row
  margin-top: 1rem
.row
  background: rgba(61,89,124,.15)
</style>
