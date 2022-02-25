<template>
  <div class="q-pa-md doc-container">
    <q-badge>items-start</q-badge>
    <div class="row items-start">
      <div class="col">
        One of three cols
      </div>
      <div class="col">
        One of three cols
      </div>
      <div class="col">
        One of three cols
      </div>
    </div>

    <q-badge>items-center</q-badge>
    <div class="row items-center">
      <div class="col">
        One of three cols
      </div>
      <div class="col">
        One of three cols
      </div>
      <div class="col">
        One of three cols
      </div>
    </div>

    <q-badge>items-end</q-badge>
    <div class="row items-end">
      <div class="col">
        One of three cols
      </div>
      <div class="col">
        One of three cols
      </div>
      <div class="col">
        One of three cols
      </div>
    </div>

    <q-badge>self-*</q-badge>
    <div class="row">
      <div class="col self-start">
        .self-start
      </div>
      <div class="col self-center">
        .self-center
      </div>
      <div class="col self-end">
        .self-end
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.row
  height: 5rem
  background: rgba(61,89,124,.15)
.row > div
  padding: 10px 15px
  background: rgba(61,89,124, .20)
  border: 1px solid rgba(126,135,149, .6)
.doc-container > div + div
  margin-top: 1rem
</style>
