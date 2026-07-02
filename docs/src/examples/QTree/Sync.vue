<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree
      class="col-12 col-sm-6"
      :nodes="simple"
      node-key="label"
      tick-strategy="leaf"
      v-model:selected="selected"
      v-model:ticked="ticked"
      v-model:expanded="expanded"
    />
    <div class="col-12 col-sm-6 q-gutter-sm">
      <div class="text-h6">Selected</div>
      <div>{{ selected }}</div>

      <q-separator spaced />

      <div class="text-h6">Ticked</div>
      <div>
        <div v-for="tick in ticked" :key="`ticked-${tick}`">
          {{ tick }}
        </div>
      </div>

      <q-separator spaced />

      <div class="text-h6">Expanded</div>
      <div>
        <div v-for="expand in expanded" :key="`expanded-${expand}`">
          {{ expand }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref('Pleasant surroundings')
const ticked = ref(['Quality ingredients', 'Good table presentation'])

const expanded = ref([
  'Satisfied customers (with avatar)',
  'Good food (with icon)'
])

const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food (with icon)',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node with icon)',
        icon: 'room_service',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings (with icon)',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere (with image)',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]
</script>
