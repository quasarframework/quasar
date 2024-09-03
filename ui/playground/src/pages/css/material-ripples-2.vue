<template>
  <div class="q-layout-padding">
    <div class="q-gutter-sm">
      <q-btn label="Regular" @click="onClick" />
      <q-btn label="Regular early=false" :ripple="{ early: false }" @click="onClick" />
      <q-btn label="Regular" loading @click="onClick" />
      <q-btn label="Link" type="a" href="about:blank" target="_blank" @click="onClick" />
    </div>

    <div class="q-gutter-sm q-pt-md">
      <q-btn label="Regular early=true" :ripple="{ early: true }" @click="onClick" />
      <q-btn label="Regular early=false" :ripple="{ early: false }" @click="onClick" />
      <q-btn label="Regular early=true" loading :ripple="{ early: true }" @click="onClick" />
      <q-btn label="Link early" :ripple="{ early: true }" type="a" href="about:blank" target="_blank" @click="onClick" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClick () {
      console.log('onClick')
    }
  }
}
</script>
