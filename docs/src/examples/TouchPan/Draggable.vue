<template>
  <div class="q-pa-md">
    <q-layout view="lhh LpR lff" container style="height: 500px" class="shadow-2 rounded-borders">
      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
          </p>

          <q-page-sticky position="bottom-right" :offset="fabPos">
            <q-fab
              icon="add"
              direction="up"
              color="accent"
              :disable="draggingFab"
              v-touch-pan.prevent.mouse="moveFab"
            >
              <q-fab-action @click="onClick" color="primary" icon="person_add" :disable="draggingFab" />
              <q-fab-action @click="onClick" color="primary" icon="mail" :disable="draggingFab" />
            </q-fab>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const fabPos = ref([ 18, 18 ])
    const draggingFab = ref(false)

    return {
      fabPos,
      draggingFab,

      onClick () {
        // console.log('Clicked on a fab action')
      },

      moveFab (ev) {
        draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

        fabPos.value = [
          fabPos.value[ 0 ] - ev.delta.x,
          fabPos.value[ 1 ] - ev.delta.y
        ]
      }
    }
  }
}
</script>
