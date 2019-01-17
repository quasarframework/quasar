<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-circular-progress
        class="q-ma-sm text-white"
        size="25px"
        color="orange"
        center-color="grey-8"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        size="50px"
        color="orange"
        center-color="grey-8"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        size="100px"
        color="orange"
        center-color="grey-8"
        indeterminate
      />
    </div>

    <div class="q-gutter-sm">
      <q-circular-progress
        size="25px"
        color="red"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm"
        size="50px"
        color="blue"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm"
        size="100px"
        color="green"
        indeterminate
      />
    </div>

    <div class="q-gutter-sm">
      <q-circular-progress
        class="q-ma-sm text-black"
        size="25px"
        color="grey-8"
        track-color="orange"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm text-black"
        size="50px"
        color="red"
        track-color="grey-8"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm text-black"
        size="100px"
        color="blue"
        track-color="green"
        indeterminate
      />
    </div>
    <div class="q-gutter-sm">
      <q-circular-progress
        class="q-ma-sm text-white"
        size="25px"
        :thickness="1"
        color="grey-8"
        center-color="white"
        track-color="orange"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        size="50px"
        :thickness="1"
        color="grey-8"
        center-color="blue"
        track-color="orange"
        indeterminate
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        size="100px"
        :thickness="1"
        color="grey-8"
        center-color="red"
        track-color="orange"
        indeterminate
      />
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
