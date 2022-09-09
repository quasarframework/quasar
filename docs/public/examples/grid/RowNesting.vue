<template>
  <div class="q-pa-md">

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

<style lang="sass" scoped>
.row
  background: rgba(255,0,0,.1)
.row > div
  padding: 10px 15px
  background: rgba(86,61,124,.15)
  border: 1px solid rgba(86,61,124,.2)
</style>
