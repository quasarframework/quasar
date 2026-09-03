<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      dropdown-hover
      :dropdown-hover-delay="200"
      :toolbar="[
        [
          {
            label: 'Formatting',
            icon: 'format_size',
            fixedLabel: true,
            list: 'no-icons',
            options: ['p', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: 'Align',
            icon: 'format_align_left',
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['bold', 'italic', 'underline']
      ]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editor = ref(
  'Point at one of the two dropdowns to open it, then move across to the other one.'
)
</script>
