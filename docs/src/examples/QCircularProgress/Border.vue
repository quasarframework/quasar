<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      rounded
      :value="value"
      size="100px"
      color="orange"
      class="q-ma-md"
      :borderWidth="2"
      borderColor="blue"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="130px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-md"
      :borderWidth="4"
      borderColor="blue"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="150px"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="q-ma-md"
      :borderWidth="4"
      borderColor="blue"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="190px"
      :thickness="0.4"
      color="orange"
      track-color="grey-3"
      center-color="grey-8"
      class="q-ma-md"
      :borderWidth="7"
      borderColor="blue"
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
