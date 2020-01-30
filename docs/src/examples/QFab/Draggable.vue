<template>
  <div class="q-pa-md">
    <q-layout view="lhh LpR lff" container style="height: 500px" class="shadow-2 rounded-borders">
      <q-header reveal class="bg-black">
        <q-toolbar>
          <q-btn flat round dense icon="menu" ></q-btn>
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

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
              :disable="fabDragged"
              v-touch-pan.mouse="moveFab"
            >
              <q-fab-action @click="onClick" color="primary" icon="person_add" :disable="fabDragged"></q-fab-action>
              <q-fab-action @click="onClick" color="primary" icon="mail" :disable="fabDragged"></q-fab-action>
            </q-fab>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fabPos: [ 18, 18 ],
      fabDragged: false
    }
  },

  methods: {
    onClick () {
      // console.log('Clicked on a fab action')
    },

    moveFab (ev) {
      this.fabDragged = ev.isFirst !== true && ev.isFinal !== true

      this.fabPos = [
        this.fabPos[0] - ev.delta.x,
        this.fabPos[1] - ev.delta.y
      ]
    }
  }
}
</script>
