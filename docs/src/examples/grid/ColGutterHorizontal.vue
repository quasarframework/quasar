<template>
  <div class="q-pa-md example-col-gutter-horizontal">

    <div class="row q-col-gutter-x-md">
      <div class="col-4" v-for="n in 5" :key="`none-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

  </div>
</template>

<style lang="sass">
.example-col-gutter-horizontal
  .my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
