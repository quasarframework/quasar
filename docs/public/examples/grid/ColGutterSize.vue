<template>
  <div class="q-pa-md">

    <div class="row q-col-gutter-none">
      <div class="col-4" v-for="n in 5" :key="`none-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-xs">
      <div class="col-4" v-for="n in 5" :key="`xs-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-sm">
      <div class="col-4" v-for="n in 5" :key="`sm-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-md">
      <div class="col-4" v-for="n in 5" :key="`md-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-lg">
      <div class="col-4" v-for="n in 5" :key="`lg-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-xl">
      <div class="col-4" v-for="n in 5" :key="`xl-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

  </div>
</template>

<style lang="sass" scoped>
.my-content
  padding: 10px 15px
  background: rgba(86,61,124,.15)
  border: 1px solid rgba(86,61,124,.2)
</style>
