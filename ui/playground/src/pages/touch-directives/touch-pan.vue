<template>
  <div class="q-layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw">
      <p class="caption">
        <span class="desktop-only"
          >Click then pan in a direction with your mouse</span
        >
        <span class="mobile-only">Touch and pan in a direction</span>
        on the area below to see it in action.
        <br />
        Page scrolling is prevented, but you can opt out if you wish.
      </p>
      <div>
        <q-toggle v-model="disable" label="Directive disabled" />
        Click status: {{ clickStatus }}
      </div>
      <div
        v-touch-pan.prevent.mouse="computedHandlePan"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center relative-position"
        ref="area"
      >
        <q-icon
          class="absolute-top-left"
          size="md"
          name="drag_indicator"
          draggable
        />

        <div v-if="info" class="custom-info">
          <pre>{{ info }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon size="md" name="arrow_upward" />
          <div class="row items-center">
            <q-icon size="md" name="arrow_back" />
            <div>Pan in any direction</div>
            <q-icon size="md" name="arrow_forward" />
          </div>
          <q-icon size="md" name="arrow_downward" />
        </div>

        <div v-if="panning" class="touch-signal">
          <q-icon size="md" name="touch_app" />
        </div>
      </div>

      <p class="caption"
        >Page scrolling is prevented, but you can opt out if you wish.</p
      >
      <div>Click status: {{ clickStatus }}</div>
      <div
        v-touch-pan.prevent.right.mouse="handlePanRight"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
        ref="area"
      >
        <div v-if="infoRight" class="custom-info">
          <pre>{{ infoRight }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <div class="row items-center">
            <div>Pan right</div>
            <q-icon size="md" name="arrow_forward" />
          </div>
        </div>

        <div v-if="panningRight" class="touch-signal">
          <q-icon size="md" name="touch_app" />
        </div>
      </div>

      <p class="caption"
        >Page scrolling is prevented, but you can opt out if you wish.</p
      >
      <div>Click status: {{ clickStatus }}</div>
      <div
        v-touch-pan.prevent.up.right.mouse="handlePanUpRight"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
        ref="area"
      >
        <div v-if="infoUpRight" class="custom-info">
          <pre>{{ infoUpRight }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon size="md" name="arrow_upward" />
          <div class="row items-center">
            <div>Pan up & right</div>
            <q-icon size="md" name="arrow_forward" />
          </div>
        </div>

        <div v-if="panningUpRight" class="touch-signal">
          <q-icon size="md" name="touch_app" />
        </div>
      </div>

      <p class="caption">
        Panning works both with a mouse or a native touch action.
        <br />
        You can also capture pan to certain directions (any) only as you'll see
        below.
      </p>

      <p class="caption">
        Example on capturing only horizontal panning.
        <br />
        Notice that on touch capable devices the scrolling is automatically not
        blocked, since we are only capturing horizontally.
      </p>
      <div>Click status: {{ clickStatus }}</div>
      <div
        v-touch-pan.horizontal.prevent.mouse.mouseStop="panHorizontally"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
      >
        <div v-if="infoHorizontal" class="custom-info">
          <pre>{{ infoHorizontal }}</pre>
        </div>
        <div v-else class="row items-center q-pa-xl custom-area-placeholder">
          <q-icon size="md" name="arrow_back" />
          <div>Pan to left or right only</div>
          <q-icon size="md" name="arrow_forward" />
        </div>

        <div v-if="panningHorizontal" class="touch-signal">
          <q-icon size="md" name="touch_app" />
        </div>
      </div>

      <p class="caption">
        Example on capturing only vertically panning. Page scrolling is
        prevented, but you can opt out if you wish.
      </p>
      <div>Click status: {{ clickStatus }}</div>
      <div
        v-touch-pan.vertical.prevent.mouse="panVertically"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
      >
        <div v-if="infoVertical" class="custom-info">
          <pre>{{ infoVertical }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon size="md" name="arrow_upward" />
          <div>Pan to up or down only</div>
          <q-icon size="md" name="arrow_downward" />
        </div>

        <div v-if="panningVertical" class="touch-signal">
          <q-icon size="md" name="touch_app" />
        </div>
      </div>

      <p class="caption">
        For desktops, you can configure to avoid capturing mouse pans if you
        wish.
      </p>

      <p class="caption">Pan test (preventing it from inner square)</p>
      <div
        v-touch-pan.prevent.mouse="handlePanTest"
        @click="e => onEvt('click', e)"
        class="row flex-center bg-blue-4"
      >
        <div
          @touchstart="handleEvt"
          @mousedown="handleEvt"
          style="padding: 24px"
          class="cursor-pointer bg-primary text-white rounded-borders shadow-2 relative-position"
        >
          <div>
            <q-toggle
              dark
              color="black"
              v-model="panTestStopPropagation"
              label="Stop propagation"
            />
          </div>

          <div v-if="infoTest" class="custom-info">
            <pre>{{ infoTest }}</pre>
          </div>

          <div v-else class="text-center q-pa-xl custom-area-placeholder">
            <q-icon size="md" name="arrow_upward" />
            <div class="row items-center">
              <q-icon size="md" name="arrow_back" />
              <div>Pan in any direction</div>
              <q-icon size="md" name="arrow_forward" />
            </div>
            <q-icon size="md" name="arrow_downward" />
          </div>

          <div v-if="panningTest" class="touch-signal">
            <q-icon size="md" name="touch_app" />
          </div>
        </div>
      </div>

      <p class="caption">
        Pan test (capture + preventing it from inner square) -- should still
        work
      </p>
      <div
        v-touch-pan.prevent.capture.mouse.mouseCapture="handlePanTestCapture"
        @click="e => onEvt('click', e)"
        class="row flex-center bg-blue-4"
      >
        <div
          @touchstart.stop
          @mousedown.stop
          style="padding: 24px"
          class="cursor-pointer bg-primary text-white rounded-borders shadow-2 relative-position"
        >
          <div v-if="infoTestCapture" class="custom-info">
            <pre>{{ infoTestCapture }}</pre>
          </div>

          <div v-else class="text-center q-pa-xl custom-area-placeholder">
            <q-icon size="md" name="arrow_upward" />
            <div class="row items-center">
              <q-icon size="md" name="arrow_back" />
              <div>Pan in any direction</div>
              <q-icon size="md" name="arrow_forward" />
            </div>
            <q-icon size="md" name="arrow_downward" />
          </div>

          <div v-if="panningTestCapture" class="touch-signal">
            <q-icon size="md" name="touch_app" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import './touch-style.sass'

const info = ref(null)
const panning = ref(false)
const clickStatus = ref(null)
const disable = ref(false)

const infoRight = ref(null)
const panningRight = ref(false)

const infoUpRight = ref(null)
const panningUpRight = ref(false)

const infoHorizontal = ref(null)
const panningHorizontal = ref(false)

const infoVertical = ref(null)
const panningVertical = ref(false)

const panTestStopPropagation = ref(true)
const infoTest = ref(null)
const panningTest = ref(false)

const infoTestCapture = ref(null)
const panningTestCapture = ref(false)

const computedHandlePan = computed(() => (disable.value ? void 0 : handlePan))

function handlePan({ evt, ...localInfo }) {
  info.value = localInfo

  // native Javascript event
  // console.log(evt)

  if (localInfo.isFirst) {
    panning.value = true
    clickStatus.value = null
  } else if (localInfo.isFinal) {
    panning.value = false
  }
}
function handlePanRight({ evt, ...localInfo }) {
  infoRight.value = localInfo

  // native Javascript event
  // console.log(evt)

  if (localInfo.isFirst) {
    panningRight.value = true
    clickStatus.value = null
  } else if (localInfo.isFinal) {
    panningRight.value = false
  }
}
function handlePanUpRight({ evt, ...localInfo }) {
  infoUpRight.value = localInfo

  // native Javascript event
  // console.log(evt)

  if (localInfo.isFirst) {
    panningUpRight.value = true
    clickStatus.value = null
  } else if (localInfo.isFinal) {
    panningUpRight.value = false
  }
}
function panHorizontally({ evt, ...localInfo }) {
  infoHorizontal.value = localInfo

  // native Javascript event
  // console.log(evt)

  if (localInfo.isFirst) {
    panningHorizontal.value = true
    clickStatus.value = null
  } else if (localInfo.isFinal) {
    panningHorizontal.value = false
  }
}
function panVertically({ evt, ...localInfo }) {
  infoVertical.value = localInfo

  // native Javascript event
  // console.log(evt)

  if (localInfo.isFirst) {
    panningVertical.value = true
    clickStatus.value = null
  } else if (localInfo.isFinal) {
    panningVertical.value = false
  }
}

function handleEvt(e) {
  if (panTestStopPropagation.value) {
    e.stopPropagation()
  }
}
function handlePanTest({ evt, ...localInfo }) {
  infoTest.value = localInfo

  // native Javascript event
  console.log(evt)

  if (localInfo.isFirst) {
    panningTest.value = true
    clickStatus.value = null
  } else if (localInfo.isFinal) {
    panningTest.value = false
  }
}

function handlePanTestCapture({ evt, ...localInfo }) {
  infoTestCapture.value = localInfo

  // native Javascript event
  console.log(evt)

  if (localInfo.isFirst) {
    panningTestCapture.value = true
    clickStatus.value = null
  } else if (localInfo.isFinal) {
    panningTestCapture.value = false
  }
}

function onEvt(reason, evt) {
  console.log('@' + reason)
  if (reason === 'click') {
    clickStatus.value = {
      stopped: evt.cancelBubble,
      prevented: evt.defaultPrevented
    }
  }
}
</script>
