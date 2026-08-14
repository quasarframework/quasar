<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh Lpr lFf"
      container
      style="height: 400px"
      class="shadow-2 rounded-borders"
    >
      <q-header reveal elevated>
        <q-toolbar>
          <q-btn
            aria-label="Toggle left drawer"
            flat
            round
            dense
            icon="menu"
            @click="drawerLeft = !drawerLeft"
          />

          <q-toolbar-title> <strong>Quasar</strong> Framework </q-toolbar-title>

          <q-btn
            aria-label="Toggle right drawer"
            flat
            round
            dense
            icon="menu"
            @click="drawerRight = !drawerRight"
          />
        </q-toolbar>
      </q-header>

      <q-footer reveal elevated>
        <q-toolbar>
          <q-btn
            aria-label="Toggle left drawer"
            flat
            round
            dense
            icon="menu"
            @click="drawerLeft = !drawerLeft"
          />

          <q-toolbar-title> <strong>Quasar</strong> Framework </q-toolbar-title>

          <q-btn
            aria-label="Toggle right drawer"
            flat
            round
            dense
            icon="menu"
            @click="drawerRight = !drawerRight"
          />
        </q-toolbar>
      </q-footer>

      <q-drawer
        v-model="drawerLeft"
        :width="150"
        :breakpoint="700"
        behavior="desktop"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
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
        :width="150"
        :breakpoint="500"
        behavior="desktop"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <!-- place QPageSticky at end of page -->
          <q-page-sticky position="top-left" :offset="[18, 18]">
            <q-btn
              aria-label="Sticky top left"
              round
              color="accent"
              icon="arrow_back"
              class="rotate-45"
            />
          </q-page-sticky>
          <q-page-sticky position="top" :offset="[0, 18]">
            <q-btn
              aria-label="Sticky top"
              round
              color="accent"
              icon="arrow_back"
              class="rotate-90"
            />
          </q-page-sticky>
          <q-page-sticky position="top-right" :offset="[18, 18]">
            <q-btn
              aria-label="Sticky top right"
              round
              color="accent"
              icon="arrow_upward"
              class="rotate-45"
            />
          </q-page-sticky>
          <q-page-sticky position="right" :offset="[18, 0]">
            <q-btn
              aria-label="Sticky right"
              round
              color="accent"
              icon="arrow_upward"
              class="rotate-90"
            />
          </q-page-sticky>
          <q-page-sticky position="left" :offset="[18, 0]">
            <q-btn
              aria-label="Sticky left"
              round
              color="accent"
              icon="arrow_back"
            />
          </q-page-sticky>
          <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-btn
              aria-label="Sticky bottom left"
              round
              color="accent"
              icon="arrow_forward"
              class="rotate-135"
            />
          </q-page-sticky>
          <q-page-sticky position="bottom" :offset="[0, 18]">
            <q-btn
              aria-label="Sticky bottom"
              round
              color="accent"
              icon="arrow_forward"
              class="rotate-90"
            />
          </q-page-sticky>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
              aria-label="Sticky bottom right"
              round
              color="accent"
              icon="arrow_forward"
              class="rotate-45"
            />
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const drawerLeft = ref($q.screen.width > 700)
const drawerRight = ref($q.screen.width > 500)
</script>
