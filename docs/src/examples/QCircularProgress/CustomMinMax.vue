<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      :min="40"
      :max="70"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :min="55"
      :max="90"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :min="40"
      :max="110"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :min="20"
      :max="70"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
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
