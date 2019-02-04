<template>
  <div class="q-pa-md" style="max-width: 500px">
    <div class="row">
      <div class="offset-1 col-5">
        <p>Styling on parent</p>
        <div class="bg-yellow q-pa-sm">Yellow block</div>
        <div class="row q-gutter-lg bg-red-4">
          <div class="q-pa-md bg-green-3" v-for="n in 4" :key="n">Child</div>
        </div>
      </div>
      <div class="offset-1 col-5">
        <p>Styling on wrapper</p>
        <div class="bg-yellow q-pa-sm">Yellow block</div>
        <div class="bg-red-4 clearfix">
          <div class="row q-gutter-lg">
            <div class="q-pa-md bg-green-3" v-for="n in 4" :key="n">Child</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.clearfix
  &:before, &:after
    content ' '
    display table
  &:after
    clear both
</style>
