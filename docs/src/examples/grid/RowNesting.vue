<template>
  <div class="q-pa-md example-row-nesting">

    <div class="row">
      <div class="col-sm-9">
        <p>Level 1: .col-sm-9</p>
        <div class="row">
          <div class="col-8 col-sm-6">
            Level 2: .col-8 .col-sm-6
          </div>
          <div class="col-4 col-sm-6">
            Level 2: .col-4 .col-sm-6
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-row-nesting
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
