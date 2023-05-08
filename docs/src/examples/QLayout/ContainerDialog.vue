<template>
  <div class="q-pa-md">
    <q-btn color="teal" label="Open Dialog" @click="dialog = true" />

    <q-dialog v-model="dialog">
      <q-layout view="lhh LpR lff" container style="height: 500px" class="shadow-2" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
        <q-header :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
          <q-toolbar>
            <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
          </q-toolbar>
        </q-header>

        <q-drawer
          v-model="drawerLeft"
          :width="200"
          behavior="mobile"
          bordered
        >
          <q-scroll-area class="fit">
            <div class="q-pa-sm">
              <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
            </div>
          </q-scroll-area>
        </q-drawer>

        <q-drawer
          side="right"
          v-model="drawerRight"
          bordered
          :width="200"
          :breakpoint="300"
        >
          <q-scroll-area class="fit">
            <div class="q-pa-sm">
              <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
            </div>
          </q-scroll-area>
        </q-drawer>

        <q-page-container>
          <q-page class="q-pa-md">
            <p v-for="n in 15" :key="n">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
            </p>

            <q-page-sticky position="top-left" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_back" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="top-right" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_upward" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="bottom-left" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-135" />
            </q-page-sticky>
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-45" />
            </q-page-sticky>
          </q-page>

          <q-page-scroller position="bottom">
            <q-btn fab icon="keyboard_arrow_up" color="red" />
          </q-page-scroller>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      dialog: ref(false),
      drawerLeft: ref(false),
      drawerRight: ref(true)
    }
  }
}
</script>
