<template>
  <div class="q-px-xl q-py-md" style="max-width: 500px">
    <p>.q-col-gutter with styling on children</p>
    <div class="bg-red-4 clearfix q-mt-lg">
      <div class="row q-col-gutter-lg">
        <div class="semi-transparent col-3 q-pa-md" :class="`bg-green-${n+1}`" v-for="n in 7" :key="n">
          Child
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with styling on the element inside children</p>
    <div class="bg-red-4 clearfix">
      <div class="row q-col-gutter-lg">
        <div class="col-3" v-for="n in 7" :key="n">
          <div class="q-pa-md" :class="`bg-green-${n+1}`">
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with direct QBtn children</p>
    <div class="bg-red-4 clearfix q-mt-lg">
      <div class="row q-col-gutter-lg">
        <q-btn class="semi-transparent col-4" color="primary" label="Button" v-for="n in 7" :key="`md-${n}`" />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with QBtn inside children</p>
    <div class="bg-red-4 clearfix">
      <div class="row q-col-gutter-lg">
        <div class="col-4" v-for="n in 7" :key="n">
          <q-btn class="full-width" color="primary" label="Button" />
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
.semi-transparent
  opacity .7
</style>
