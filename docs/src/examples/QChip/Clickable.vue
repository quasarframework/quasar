<template>
  <div class="q-pa-md">
    <q-chip @click="onClick" color="primary" text-color="white" icon="event">
      Add to calendar
    </q-chip>
    <q-chip @click="onClick" icon="bookmark"> Bookmark </q-chip>
    <q-chip @click="onClick" color="teal" text-color="white" icon="bookmark">
      Bookmark
    </q-chip>
    <q-chip
      @click="onClick"
      color="red"
      text-color="white"
      icon="alarm"
      label="Set alarm"
    />
    <q-chip
      @click="onClick"
      color="orange"
      text-color="white"
      icon="directions"
    >
      Get directions
    </q-chip>
  </div>
</template>

<script setup>
function onClick() {
  console.log('Clicked on a QChip')
}
</script>
