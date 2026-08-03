<template>
  <div class="q-layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw">
      <p class="caption">
        <span class="desktop-only">Click and hold with your mouse</span>
        <span class="mobile-only">Touch and hold</span>
        on the area below to see it in action.
        <br />
        The default repeat pattern is 0:600:300* (ms).
        <br />
        Notice that on touch capable devices the scrolling is not blocked if
        first timer is > 0.
      </p>

      <q-toggle v-model="disable" label="Directive disabled" />
      <div
        v-touch-repeat.mouse="computedHandleHold1"
        @click="onClick"
        class="custom-area row flex-center"
      >
        <div v-if="info1" class="custom-info">
          <pre>{{ info1 }}</pre>
        </div>
        <div
          v-else
          class="text-center q-pa-xl custom-area-placeholder"
          tabindex="0"
        >
          Click/touch and hold.
        </div>
      </div>

      <p class="caption">
        Configured to also react to <kbd>SPACE</kbd>, <kbd>ENTER</kbd> and
        <kbd>h</kbd>, with 0:300* (ms) repeat pattern:
      </p>
      <div
        v-touch-repeat:0:300.mouse.enter.space.72.104="handleHold2"
        @click="onClick"
        class="custom-area row flex-center"
        tabindex="0"
      >
        <div v-if="info2" class="custom-info">
          <pre>{{ info2 }}</pre>
        </div>
        <div v-else class="q-pa-xl custom-area-placeholder" tabindex="0">
          Click/touch or press SPACE/ENTER/H and hold
        </div>
      </div>

      <p class="caption">
        Configured to also react to <kbd>ENTER</kbd> and <kbd>h</kbd>, with
        1000:300* (ms) repeat pattern:
      </p>
      <div
        v-touch-repeat:1000:300.mouse.enter.72.104="handleHold3"
        @click="onClick"
        class="custom-area row flex-center"
        tabindex="0"
      >
        <div v-if="info3" class="custom-info">
          <pre>{{ info3 }}</pre>
        </div>
        <div v-else class="q-pa-xl custom-area-placeholder" tabindex="0">
          Click/touch or press ENTER/H and hold
        </div>
      </div>

      <p class="caption">Repeat test (preventing it from inner square)</p>
      <div
        v-touch-repeat:1000:300.mouse.enter.72.104="handleRepeatTest"
        @click="onClick"
        class="row flex-center"
      >
        <div
          @touchstart="handleEvt"
          @mousedown="handleEvt"
          @keydown="handleEvt"
          style="padding: 24px"
          class="cursor-pointer bg-primary text-white rounded-borders shadow-2 relative-position"
        >
          <div>
            <q-toggle
              dark
              color="black"
              v-model="repeatTestStopPropagation"
              label="Stop propagation"
            />
          </div>

          <div v-if="infoTest" class="custom-info">
            <pre>{{ infoTest }}</pre>
          </div>

          <div v-else class="q-pa-xl custom-area-placeholder" tabindex="0">
            Click/touch or press ENTER/H and hold
          </div>
        </div>
      </div>

      <p class="caption">
        Repeat test (capture + preventing it from inner square) -- should still
        work
      </p>
      <div
        v-touch-repeat:1000:300.capture.mouse.mouseCapture.keyCapture.enter.72.104="
          handleRepeatTestCapture
        "
        @click="onClick"
        class="row flex-center"
      >
        <div
          @touchstart.stop
          @mousedown.stop
          @keydown.stop
          style="padding: 24px"
          class="cursor-pointer bg-primary text-white rounded-borders shadow-2 relative-position"
        >
          <div v-if="infoTestCapture" class="custom-info">
            <pre>{{ infoTestCapture }}</pre>
          </div>

          <div v-else class="q-pa-xl custom-area-placeholder" tabindex="0">
            Click/touch or press ENTER/H and hold
          </div>
        </div>
      </div>

      <p class="caption">Btn test</p>
      <div class="row flex-center q-my-md">
        <q-btn
          round
          class="on-left"
          icon="remove"
          v-touch-repeat:300:600.mouse.enter.space="
            () => {
              testN -= 1
            }
          "
          @click="onClick"
        />
        <q-btn
          push
          round
          class="on-left"
          icon="remove"
          v-touch-repeat.mouse.enter.space="
            () => {
              testN -= 1
            }
          "
          @click="onClick"
        />
        <span class="q-mx-sm">{{ testN }}</span>
        <q-btn
          push
          round
          class="on-right"
          icon="add"
          v-touch-repeat.mouse.enter.space="
            () => {
              testN += 1
            }
          "
          @click="onClick"
        />
        <q-btn
          round
          class="on-right"
          icon="add"
          v-touch-repeat:300:600.mouse.enter.space="
            () => {
              testN += 1
            }
          "
          @click="onClick"
        />
      </div>

      <div style="height: 500px">Scroll on purpose</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import './touch-style.sass'

const info1 = ref(null)
const info2 = ref(null)
const info3 = ref(null)
const disable = ref(false)

const repeatTestStopPropagation = ref(true)
const infoTest = ref(null)

const infoTestCapture = ref(null)

const testN = ref(0)

const computedHandleHold1 = computed(() =>
  disable.value ? void 0 : handleHold1
)

function handleHold1({ evt, ...info }) {
  info1.value = info

  // native Javascript event
  console.log('TRIGGER', evt)
}

function handleHold2({ evt, ...info }) {
  info2.value = info

  if (info.keyboard) {
    info2.value.key = evt.key
    info2.value.code = evt.code
  }

  // native Javascript event
  console.log('TRIGGER', evt)
}

function handleHold3({ evt, ...info }) {
  info3.value = info

  if (info.keyboard) {
    info3.value.key = evt.key
    info3.value.code = evt.code
  }

  // native Javascript event
  console.log('TRIGGER', evt)
}

function handleEvt(e) {
  if (repeatTestStopPropagation.value) {
    e.stopPropagation()
  }
}

function handleRepeatTest({ evt, ...info }) {
  infoTest.value = info

  // native Javascript event
  console.log('TRIGGER', evt)
}

function handleRepeatTestCapture({ evt, ...info }) {
  infoTestCapture.value = info

  // native Javascript event
  console.log('TRIGGER', evt)
}

function onClick(evt) {
  console.log('@click', evt)
}
</script>
