<template>
  <div class="q-px-xl q-py-md" style="max-width: 500px">
    <p>.q-gutter and unsized children</p>
    <div class="row text-dark">
      <div class="col bg-amber">
        <div class="row q-gutter-lg">
          <div :class="`bg-blue-${n+1}`" v-for="n in 7" :key="n">
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter and unsized children</p>
    <div class="row text-black">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <div class="semi-transparent" :class="`bg-blue-${n+1}`" v-for="n in 7" :key="n">
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-gutter and .col-6 sized children - 2 .col-6 adds up to <strong>more than 100%</strong></p>
    <div class="row text-dark">
      <div class="col bg-amber">
        <div class="row q-gutter-lg">
          <div class="col-6" :class="`bg-blue-${n+1}`" v-for="n in 5" :key="n">
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter and .col-6 sized children - 2 .col-6 adds up to <strong>100%</strong></p>
    <div class="row text-dark">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <div class="semi-transparent col-6" :class="`bg-blue-${n+1}`" v-for="n in 5" :key="n">
            Child
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.semi-transparent
  opacity: .7
</style>
