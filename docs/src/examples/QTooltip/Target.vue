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
      <q-img src="https://cdn.quasar-framework.org/img/material.png" id="target-img-1" style="height: 100px">
        <div class="absolute-bottom-right">#target-img-1</div>
      </q-img>
      <q-img src="https://cdn.quasar-framework.org/img/parallax2.jpg" id="target-img-2" style="height: 100px">
        <div class="absolute-bottom-right">#target-img-2</div>
      </q-img>
      <q-img src="https://cdn.quasar-framework.org/img/blueish.jpg" style="height: 100px">
        <div class="absolute-bottom-right">Original parent</div>
        <q-tooltip
          :target="targetEl"
          anchor="center middle"
          self="center middle"
          content-class="bg-black"
        >Quasar Rulz!</q-tooltip>
      </q-img>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      targetEl: '#target-img-1'
    }
  }
}
</script>
