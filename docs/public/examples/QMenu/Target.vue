<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <div class="row items-center q-gutter-x-sm">
        <q-radio v-model="targetEl" :val="false" label="false (no target whatsoever)" />
        <q-radio v-model="targetEl" :val="true" label="true (original parent)" />
        <q-radio v-model="targetEl" val="#target-img-1" label="#target-img-1" />
        <q-radio v-model="targetEl" val="#target-img-2" label="#target-img-2" />
        <q-radio v-model="targetEl" val="#bogus" label="#bogus" />
      </div>
    </div>
    <div class="row justify-center">
      <q-img src="https://cdn.quasar.dev/img/material.png" id="target-img-1" style="height: 100px">
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px">#target-img-1</div>
      </q-img>
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" id="target-img-2" style="height: 100px">
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px">#target-img-2</div>
      </q-img>
      <q-img src="https://cdn.quasar.dev/img/blueish.jpg" style="height: 100px">
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px">Original parent</div>
        <q-menu touch-position :target="targetEl">
          <q-list>
            <q-item
              v-for="n in 5"
              :key="n"
              v-close-popup
              clickable
            >
              <q-item-section>Label</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-img>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      targetEl: ref('#target-img-1')
    }
  }
}
</script>
