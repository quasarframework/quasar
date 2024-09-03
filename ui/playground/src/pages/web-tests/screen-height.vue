<template>
  <div class="q-layout-padding bg-yellow">
    <div v-for="i in 200" :key="i" class="text-subtitle2">Row {{ i }}</div>
    <div class="fixed-center">{{ $q.screen.height }}</div>
    <div class="fixed" style="left: 0; right: 0; height: 3px; background: red" :style="{ top: `${$q.screen.height - 5}px` }"/>
  </div>
</template>
