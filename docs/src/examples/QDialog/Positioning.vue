<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Top" icon="keyboard_arrow_up" color="primary" @click="open('top')" />
    <q-btn label="Right" icon="keyboard_arrow_right" color="primary" @click="open('right')" />
    <q-btn label="Bottom" icon="keyboard_arrow_down" color="primary" @click="open('bottom')" />
    <q-btn label="Left" icon="keyboard_arrow_left" color="primary" @click="open('left')" />

    <q-dialog v-model="dialog" :position="position">
      <q-card style="width: 350px">
        <q-linear-progress :value="0.6" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">The Walker</div>
            <div class="text-grey">Fitz & The Tantrums</div>
          </div>

          <q-space />

          <q-btn flat round icon="fast_rewind" />
          <q-btn flat round icon="pause" />
          <q-btn flat round icon="fast_forward" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const dialog = ref(false)
    const position = ref('top')

    return {
      dialog,
      position,

      open (pos) {
        position.value = pos
        dialog.value = true
      }
    }
  }
}
</script>
