<template>
  <div class="q-pa-md" style="max-width: 500px">
    <div class="row">
      <div class="offset-1 col-3 column justify-between">
        <p>Styling on parent</p>
        <div>
          <div class="bg-yellow q-pa-sm">Yellow block</div>
          <div class="row q-gutter-lg bg-red-4">
            <div class="q-pa-md bg-green-3" v-for="n in 4" :key="n">C</div>
          </div>
        </div>
      </div>
      <div class="offset-1 col-3 column justify-between">
        <p>Styling on wrapper - .row</p>
        <div>
          <div class="bg-yellow q-pa-sm">Yellow block</div>
          <div class="bg-red-4 row">
            <div class="row q-gutter-lg">
              <div class="q-pa-md bg-green-3" v-for="n in 4" :key="n">C</div>
            </div>
          </div>
        </div>
      </div>
      <div class="offset-1 col-3 column justify-between">
        <p>Styling on wrapper - .overflow-auto</p>
        <div>
          <div class="bg-yellow q-pa-sm">Yellow block</div>
          <div class="bg-red-4 overflow-auto">
            <div class="row q-gutter-lg">
              <div class="q-pa-md bg-green-3" v-for="n in 4" :key="n">C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
