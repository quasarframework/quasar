<template>
  <div class="q-pa-md">
    <div
      v-drop-zone="{
        handler: onDrop,
        multiple: true,
        activeClass: 'drop-zone--active'
      }"
      class="drop-zone column flex-center q-pa-lg rounded-borders text-center"
    >
      <q-icon name="add_photo_alternate" size="48px" />
      <div class="q-mt-sm">{{ count }} file(s) dropped so far</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function onDrop(files) {
  count.value += files.length
}
</script>

<style lang="sass" scoped>
.drop-zone
  border: 2px dashed $grey-5
  transition: background-color .2s, border-color .2s

  &--active
    border-color: $primary
    background-color: rgba($primary, .08)
</style>
