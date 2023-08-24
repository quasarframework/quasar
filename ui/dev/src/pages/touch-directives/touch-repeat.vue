<template>
  <div class="q-layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Click and hold with your mouse</span>
        <span class="mobile-only">Touch and hold</span>
        on the area below to see it in action.
        <br>
        The default repeat pattern is 0:600:300* (ms).
        <br>
        Notice that on touch capable devices the scrolling is not blocked if first timer is > 0.
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
        <div v-else class="text-center q-pa-xl custom-area-placeholder" tabindex="0">
          Click/touch and hold.
        </div>
      </div>

      <p class="caption">
        Configured to also react to <kbd>SPACE</kbd>, <kbd>ENTER</kbd> and <kbd>h</kbd>, with 0:300* (ms) repeat pattern:
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
        Configured to also react to <kbd>ENTER</kbd> and <kbd>h</kbd>, with 1000:300* (ms) repeat pattern:
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

      <p class="caption">
        Repeat test (preventing it from inner square)
      </p>
      <div
        v-touch-repeat:1000:300.mouse.enter.72.104="handleRepeatTest"
        @click="onClick"
        class="row flex-center"
      >
        <div @touchstart="handleEvt" @mousedown="handleEvt" @keydown="handleEvt" style="padding: 24px" class="cursor-pointer bg-primary text-white rounded-borders shadow-2 relative-position">
          <div>
            <q-toggle dark color="black" v-model="repeatTestStopPropagation" label="Stop propagation" />
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
        Repeat test (capture + preventing it from inner square)
        -- should still work
      </p>
      <div
        v-touch-repeat:1000:300.capture.mouse.mouseCapture.keyCapture.enter.72.104="handleRepeatTestCapture"
        @click="onClick"
        class="row flex-center"
      >
        <div @touchstart.stop @mousedown.stop @keydown.stop style="padding: 24px" class="cursor-pointer bg-primary text-white rounded-borders shadow-2 relative-position">
          <div v-if="infoTestCapture" class="custom-info">
            <pre>{{ infoTestCapture }}</pre>
          </div>

          <div v-else class="q-pa-xl custom-area-placeholder" tabindex="0">
            Click/touch or press ENTER/H and hold
          </div>
        </div>
      </div>

      <p class="caption">
        Btn test
      </p>
      <div class="row flex-center q-my-md">
        <q-btn round class="on-left" icon="remove" v-touch-repeat:300:600.mouse.enter.space="() => { testN -= 1 }" @click="onClick" />
        <q-btn push round class="on-left" icon="remove" v-touch-repeat.mouse.enter.space="() => { testN -= 1 }" @click="onClick" />
        <span class="q-mx-sm">{{ testN }}</span>
        <q-btn push round class="on-right" icon="add" v-touch-repeat.mouse.enter.space="() => { testN += 1 }" @click="onClick" />
        <q-btn round class="on-right" icon="add" v-touch-repeat:300:600.mouse.enter.space="() => { testN += 1 }" @click="onClick" />
      </div>

      <div style="height: 500px">
        Scroll on purpose
      </div>
    </div>
  </div>
</template>

<script>
import './touch-style.sass'

export default {
  data () {
    return {
      info1: null,
      info2: null,
      info3: null,
      disable: false,

      repeatTestStopPropagation: true,
      infoTest: null,

      infoTestCapture: null,

      testN: 0
    }
  },

  computed: {
    computedHandleHold1 () {
      return this.disable === true ? void 0 : this.handleHold1
    }
  },

  methods: {
    handleHold1 ({ evt, ...info }) {
      this.info1 = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    handleHold2 ({ evt, ...info }) {
      this.info2 = info

      if (info.keyboard) {
        this.info2.key = evt.key
        this.info2.code = evt.code
      }

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    handleHold3 ({ evt, ...info }) {
      this.info3 = info

      if (info.keyboard) {
        this.info3.key = evt.key
        this.info3.code = evt.code
      }

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    handleEvt (e) {
      if (this.repeatTestStopPropagation) {
        e.stopPropagation()
      }
    },

    handleRepeatTest ({ evt, ...info }) {
      this.infoTest = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    handleRepeatTestCapture ({ evt, ...info }) {
      this.infoTestCapture = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    onClick (evt) {
      console.log('@click', evt)
    }
  }
}
</script>
