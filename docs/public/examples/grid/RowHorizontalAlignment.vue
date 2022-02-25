<template>
  <div class="q-pa-md doc-container">
    <q-badge>justify-start</q-badge>
    <div class="row justify-start">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-center</q-badge>
    <div class="row justify-center">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-end</q-badge>
    <div class="row justify-end">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-around</q-badge>
    <div class="row justify-around">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-between</q-badge>
    <div class="row justify-between">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>

    <q-badge>justify-evenly</q-badge>
    <div class="row justify-evenly">
      <div class="col-4">
        One of two cols
      </div>
      <div class="col-4">
        One of two cols
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.row
  background: rgba(61,89,124,.15)
.row > div
  padding: 10px 15px
  background: rgba(61,89,124, .20)
  border: 1px solid rgba(126,135,149, .6)
.doc-container > div + div
  margin-top: 1rem
</style>
