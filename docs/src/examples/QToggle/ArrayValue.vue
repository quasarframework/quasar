<template>
  <div class="q-pa-md q-gutter-sm">
    <q-toggle color="blue" label="Blue" v-model="selection" val="blue" />
    <q-toggle color="yellow" label="Yellow" v-model="selection" val="yellow" />
    <q-toggle color="green" label="Green" v-model="selection" val="green" />
    <q-toggle color="red" label="Red" v-model="selection" val="red" />
    <div>
      Model: {{selection}}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      selection: ref([ 'yellow', 'red' ])
    }
  }
}
</script>
