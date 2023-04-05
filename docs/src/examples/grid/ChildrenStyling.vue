<template>
  <div class="q-px-xl q-py-md" style="max-width: 500px">
    <p>.q-col-gutter with styling on children</p>
    <div class="row text-dark">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <div class="semi-transparent col-6 q-pa-md text-center" :class="`bg-blue-${n+1}`" v-for="n in 5" :key="n">
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with styling on the element inside children</p>
    <div class="row text-dark">
      <div class="col bg-amber">
        <div class="row q-col-gutter-lg">
          <div class="col-6" v-for="n in 5" :key="n">
            <div class="q-pa-md text-center" :class="`bg-blue-${n+1}`">
              Child
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with direct QBtn children</p>
    <div class="row text-dark rounded-borders">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <q-btn class="semi-transparent col-6" color="primary" label="Button" v-for="n in 5" :key="`md-${n}`" />
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with QBtn inside children</p>
    <div class="row text-dark rounded-borders">
      <div class="col bg-amber">
        <div class="row q-col-gutter-lg">
          <div class="col-6" v-for="n in 5" :key="n">
            <q-btn class="full-width" color="primary" label="Button" />
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
