<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      rounded
      :value="value"
      size="50px"
      color="orange"
      class="q-ma-md"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="90px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-md"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="50px"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="40px"
      :thickness="0.4"
      color="orange"
      track-color="grey-3"
      center-color="grey-8"
      class="q-ma-md"
    />
  </div>
</template>

<script>
export default {
  setup () {
    return {
      value: 61
    }
  }
}
</script>
