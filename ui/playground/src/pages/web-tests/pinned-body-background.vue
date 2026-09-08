<template>
  <div class="q-layout-padding pinned-body-background">
    <div class="text-h6">Body background under the scroll lock (#16799)</div>

    <p>
      This page paints a radial gradient on the body while in dark mode. Open a
      popup that locks the page scroll and the gradient must survive. On iOS the
      lock pins the body with position: fixed, which takes it out of flow; the
      root element must keep spanning the viewport, otherwise the gradient
      (whose positioning area is the root box) stops painting and a white canvas
      shows behind the popup. Desktop and Android use a viewport clip instead
      and never lose the gradient.
    </p>

    <p>
      Verdict while a popup is open: PASS when the root element is as tall as
      the viewport. Append <code>?open=select</code> or
      <code>?open=dialog</code> to the URL to open the popup automatically (for
      no-touch simulator runs).
    </p>

    <div class="q-gutter-md row items-center">
      <q-select
        ref="selectRef"
        filled
        v-model="model"
        use-input
        input-debounce="0"
        label="Select (dialog on mobile)"
        :options="options"
        @filter="filterFn"
        style="width: 250px"
      />

      <q-btn color="primary" label="Open dialog" @click="dialog = true" />
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 300px">
        <q-card-section>Dialog over the gradient</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="pinned-body-background__probe">
      <div>platform: {{ platform }}</div>
      <div>locked: {{ probe.locked }}</div>
      <div>html classes: {{ probe.htmlClasses || '(none)' }}</div>
      <div>body position: {{ probe.bodyPosition }}</div>
      <div
        >html height: {{ probe.htmlHeight }} / viewport:
        {{ probe.viewportHeight }}</div
      >
      <div class="text-weight-bold">
        {{ probe.locked ? (probe.pass ? 'PASS' : 'FAIL') : 'open a popup' }}
      </div>
    </div>

    <div v-for="i in 60" :key="i"
      >Filler row {{ i }} (scroll down, then open a popup)</div
    >
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute()

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const selectRef = useTemplateRef('selectRef')
const model = ref(null)
const options = ref(stringOptions)
const dialog = ref(false)
const platform = ref('')

const probe = ref({
  locked: false,
  htmlClasses: '',
  bodyPosition: '',
  htmlHeight: 0,
  viewportHeight: 0,
  pass: false
})

function filterFn(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}

let rafId = null

function measure() {
  const htmlHeight = Math.round(
    document.documentElement.getBoundingClientRect().height
  )
  const viewportHeight = window.innerHeight

  probe.value = {
    locked: document.qScrollPrevented === true,
    htmlClasses: document.documentElement.className,
    bodyPosition: getComputedStyle(document.body).position,
    htmlHeight,
    viewportHeight,
    pass: htmlHeight >= viewportHeight
  }

  rafId = requestAnimationFrame(measure)
}

let wasDark = false

onMounted(() => {
  platform.value = $q.platform.is.ios
    ? 'ios (body pinned)'
    : 'not ios (viewport clipped)'

  wasDark = $q.dark.isActive
  $q.dark.set(true)
  document.body.classList.add('pinned-body-background__body')

  measure()

  if (route.query.open === 'select') {
    setTimeout(() => {
      selectRef.value.showPopup()
    }, 1500)
  } else if (route.query.open === 'dialog') {
    setTimeout(() => {
      dialog.value = true
    }, 1500)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  document.body.classList.remove('pinned-body-background__body')
  $q.dark.set(wasDark)
})
</script>

<style lang="sass">
body.pinned-body-background__body
  background: radial-gradient(ellipse farthest-corner at center top, #373c4b 0%, #192038 100%)

.pinned-body-background
  min-height: 100vh

.pinned-body-background__probe
  position: fixed
  right: 8px
  bottom: 8px
  z-index: 10000
  padding: 6px 8px
  font-family: monospace
  font-size: 12px
  background: rgba(0, 0, 0, .75)
  color: #fff
  pointer-events: none
</style>
