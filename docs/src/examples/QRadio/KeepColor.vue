<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio keep-color v-model="color" val="teal" label="Teal" color="teal" />
      <q-radio keep-color v-model="color" val="orange" label="Orange" color="orange" />
      <q-radio keep-color v-model="color" val="blue-grey" label="Blue Grey" color="blue-grey" />
      <q-radio keep-color v-model="color" val="cyan" label="Cyan" color="cyan" />
    </div>
    <div class="q-px-sm">
      Your selection is: <strong>{{ color }}</strong>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      color: ref('cyan')
    }
  }
}
</script>
