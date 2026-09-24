<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">target ref, declarative + imperative</div>
        <div class="row q-gutter-sm items-center">
          <q-toggle v-model="requested" label="fullscreen option" />
          <q-toggle v-model="noRouteExit" label="noRouteExit" />
          <q-toggle v-model="useSecond" label="target = second panel" />
          <q-toggle v-model="showPanel" label="render the first panel" />
          <q-btn flat label="toggleFullscreen()" @click="toggleFullscreen" />
        </div>
        <div class="q-mt-sm q-gutter-sm">
          <q-badge :label="`inFullscreen: ${inFullscreen}`" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-md">
        <div
          v-if="showPanel"
          ref="firstRef"
          class="panel col bg-amber rounded-borders q-pa-md"
          :class="{ fullscreen: inFullscreen && !useSecond }"
        >
          <div class="row items-center">
            <div>first panel</div>
            <q-space />
            <q-btn
              flat
              dense
              round
              icon="fullscreen"
              @click="toggleFullscreen"
            />
          </div>
          <q-input
            v-model="text"
            label="state survives the move"
            class="q-mt-md"
          />
        </div>
        <div
          ref="secondRef"
          class="panel col bg-teal text-white rounded-borders q-pa-md"
          :class="{ fullscreen: inFullscreen && useSecond }"
        >
          <div class="row items-center">
            <div>second panel</div>
            <q-space />
            <q-btn
              flat
              dense
              round
              icon="fullscreen"
              @click="toggleFullscreen"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6"
          >popups stay above (QMenu on a fullscreen panel)</div
        >
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div
          ref="menuPanelRef"
          class="panel bg-grey-3 rounded-borders q-pa-md"
          :class="{ fullscreen: menuPanel.inFullscreen.value }"
        >
          <q-btn
            color="primary"
            label="menu"
            @click="menuPanel.toggleFullscreen"
          >
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item
                  clickable
                  v-close-popup
                  @click="menuPanel.exitFullscreen"
                >
                  <q-item-section>exit fullscreen</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useSoftFullscreen } from 'quasar'

const firstRef = useTemplateRef('firstRef')
const secondRef = useTemplateRef('secondRef')
const menuPanelRef = useTemplateRef('menuPanelRef')

const requested = ref(false)
const noRouteExit = ref(false)
const useSecond = ref(false)
const showPanel = ref(true)
const text = ref('')

const target = computed(() => (useSecond.value ? secondRef : firstRef).value)

const { inFullscreen, toggleFullscreen } = useSoftFullscreen(() => ({
  target,
  fullscreen: requested.value,
  noRouteExit: noRouteExit.value
}))

watch(inFullscreen, val => {
  requested.value = val
})

const menuPanel = useSoftFullscreen({ target: menuPanelRef })
</script>

<style lang="sass" scoped>
.panel
  min-height: 150px
</style>
