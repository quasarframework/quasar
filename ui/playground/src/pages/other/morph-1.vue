<template>
  <div
    class="q-layout-padding relative-position"
    style="padding-top: 30vh; padding-bottom: 30vh; min-height: 200vh"
  >
    <div class="fixed-top-right q-mr-xl rounded-borders row z-top">
      <div class="q-px-sm bg-orange">
        <q-toggle
          v-model="btn1Position"
          keep-color
          toggle-indeterminate
          :label="btn1PositionText"
        />
      </div>
      <div class="q-px-sm bg-yellow">
        <q-toggle
          v-model="card1Position"
          keep-color
          toggle-indeterminate
          :label="card1PositionText"
        />
      </div>
      <q-toggle
        v-model="tween"
        label="Use tween"
      />
      <q-toggle
        v-model="forceResize"
        label="Force resize"
      />
      <q-toggle
        v-model="forceCssAnimation"
        label="Force CSS animation"
      />
    </div>

    <div class="q-pa-sm row no-wrap items-end justify-center" style="margin-top: 300px">
      <div class="bg-red text-white q-pa-sm q-my-md q-mr-md">B</div>

      <q-btn
        v-if="toggle1 !== true"
        class="q-mx-sm q-mt-xl"
        ref="flipFrom1"
        :class="btn1Class"
        style="z-index: 1"
        unelevated
        fab
        color="orange"
        icon="add"
        @click="test1"
      />

      <div class="bg-red text-white q-pa-sm q-my-md q-ml-md">A</div>
    </div>

    <div class="bg-green text-center q-pa-md">
      After After After After After After After After After After After After After After After After After After
    </div>

    <div
      class="q-pa-sm row no-wrap flex-center"
      style="z-index: 1"
      :class="card1Class"
    >
      <div class="bg-red text-white q-pa-sm q-my-md q-mr-md">B</div>

      <q-card
        v-if="toggle1 === true"
        ref="flipTo1"
        class="bg-yellow all-pointer-events q-mx-sm q-mb-xl"
        flat
        bordered
        @click="test1"
      >
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Overline</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
            <div class="text-caption text-grey">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-img
              class="rounded-borders"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            flat
            round
            icon="event"
          />
          <q-btn flat>
            7:30PM
          </q-btn>
          <q-btn
            flat
            color="primary"
          >
            Reserve
          </q-btn>
        </q-card-actions>
      </q-card>

      <div class="bg-red text-white q-pa-sm q-my-md q-ml-md">A</div>
    </div>

    <div class="bg-green text-center q-pa-md">
      After After After After After After After After After After After After After After After After After After
    </div>

    <div
      class="relative-position bg-red-4"
      style="height: 200px"
    >
      <div
        class="test-2"
        :class="div2Class"
        v-text="div2Text"
        @click="test2"
      />
    </div>
  </div>
</template>

<script>
import { morph } from 'quasar'

export default {
  data () {
    return {
      forceResize: false,
      forceCssAnimation: false,
      tween: false,

      btn1Position: null,
      card1Position: null,
      toggle1: false,

      toggle2: false
    }
  },

  computed: {
    btn1PositionText () {
      if (this.btn1Position === null) {
        return 'Static -> Fixed'
      }
      return this.btn1Position === true ? 'Fixed -> Absolute' : 'Absolute -> Static'
    },

    card1PositionText () {
      if (this.card1Position === null) {
        return 'Static -> Fixed'
      }
      return this.card1Position === true ? 'Fixed -> Absolute' : 'Absolute -> Static'
    },

    btn1Class () {
      if (this.btn1Position !== null) {
        return this.btn1Position === true ? 'fixed-top-left' : 'absolute-top-left'
      }
    },

    card1Class () {
      if (this.card1Position !== null) {
        return this.card1Position === true ? 'fixed-bottom' : 'absolute-bottom'
      }
    },

    div2Text () {
      return this.toggle2 === false
        ? 'A short text'
        : 'A much longer text to show how it works. It should grow / shrink. Is it working?'
    },

    div2Class () {
      return this.toggle2 === false
        ? 'absolute-top-left rounded-borders bg-red-2 q-pa-lg q-ma-sm'
        : 'absolute-bottom-right bg-red-6 q-pa-sm q-ma-md'
    }
  },

  methods: {
    test1 () {
      const onToggle = () => { this.toggle1 = this.toggle1 !== true }

      if (this.cancel1 === void 0 || this.cancel1() === false) {
        this.cancel1 = morph({
          from: () => {
            const ref = this.$refs[ this.toggle1 === true ? 'flipTo1' : 'flipFrom1' ]
            return ref ? ref.$el || ref : null
          },
          onToggle,
          waitFor: this.toggle1 !== true ? 'transitionend' : 0,
          duration: 800,
          easing: 'ease-in-out',
          resize: this.forceResize,
          useCSS: this.forceCssAnimation,
          tween: this.tween,
          tweenFromOpacity: 1,
          tweenToOpacity: 0.5,
          onEnd: end => {
            end === 'from' && onToggle()
            console.log('Morph 1 ready: ' + end)
          }
        })
      }
    },

    test2 () {
      const onToggle = () => { this.toggle2 = this.toggle2 !== true }

      if (this.cancel2 === void 0 || this.cancel2() === false) {
        this.cancel2 = morph({
          from: '.test-2',
          onToggle,
          duration: 500,
          easing: 'ease-in-out',
          resize: this.forceResize,
          useCSS: this.forceCssAnimation,
          classes: 'bg-orange',
          onEnd: end => {
            end === 'from' && onToggle()
            console.log('Morph 2 ready: ' + end)
          }
        })
      }
    }
  }
}
</script>
