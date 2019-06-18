<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-badge color="teal">
        Model: {{ model }}
      </q-badge>
      <q-badge color="purple" text-color="white">
        Mask: hh[h and ]mm[ minutes (]A)
      </q-badge>
    </div>

    <div class="q-mt-sm">
      <q-time v-model="model" mask="hh[h and ]mm[ minutes (]A)" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: '10h and 20 minutes (AM)'
    }
  }
}
</script>
