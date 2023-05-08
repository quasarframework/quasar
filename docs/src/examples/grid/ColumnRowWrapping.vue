<template>
  <div class="q-pa-md example-column-row-wrapping">
    <div class="column" style="height: 300px; max-height: 100%">
      <div class="col-9">.col-9</div>
      <div class="col-5">
        .col-5
        <br>Since 9 + 5 = 14 &gt; 12, this 5-row-wide div
        <br>gets wrapped onto a new line as one
        <br>contiguous unit.
      </div>
      <div class="col-6">
        .col-6
        <br>Subsequent rows
        <br>continue along the
        <br>new line.
      </div>
    </div>

    <div class="column" style="height: 150px">
      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>
      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>

      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>
      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-row-wrapping
  .column
    background: rgba(#aa0, .1)
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
