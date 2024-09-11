<template>
  <div class="q-layout-padding">
    <q-toggle v-model="horizontal" label="Horizontal content" />
    <q-toggle v-model="customStyle" label="Custom style" />
    <q-toggle v-model="alwaysVisible" toggle-indeterminate label="Always visible" />
    <q-toggle v-model="darkVariant" toggle-indeterminate label="Dark variant" />
    <q-toggle v-model="focusable" label="Focusable" />

    <div class="row items-center">
      <div class="q-mr-md">
        <div>Start offset</div>
        <q-slider v-model="topOffset" :min="0" :max="100" label-always switch-label-side style="width: 200px"/>
      </div>

      <div>
        <div>End offset</div>
        <q-slider v-model="bottomOffset" :min="0" :max="100" label-always switch-label-side style="width: 200px"/>
      </div>
    </div>

    <div style="height: 50px;" />

    <keep-alive>
      <q-scroll-area
        v-if="!darkVariant"
        key="scl"
        ref="scrollRef"
        style="width: 400px; height: 500px;"
        class="bg-yellow"
        :vertical-offset="[topOffset, bottomOffset]"
        :visible="alwaysVisible"
        :bar-style="customBarStyle"
        :vertical-bar-style="customVBarStyle"
        :horizontal-bar-style="customHBarStyle"
        :thumbStyle="customThumbStyle"
        :vertical-thumb-style="customVThumbStyle"
        :horizontal-thumb-style="customHThumbStyle"
        :tabindex="focusable === true ? 0 : void 0"
      >
        <div v-if="topOffset" :style="`height: ${topOffset}px`" class="flex flex-center text-white" style="top:0;position:sticky;backdrop-filter: blur(8px);background: #0008;z-index: 1;">User-Defined Header</div>

        <div :class="{ 'flex no-wrap' : horizontal }">
          <div>
            testComputed: {{testComputed}}
          </div>
          <div>
            testFx: {{testFx()}}
          </div>
          <div style="margin-block: 12px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>

        <div v-if="bottomOffset" :style="`height: ${bottomOffset}px`" class="flex flex-center text-white" style="bottom:0;position:sticky;backdrop-filter: blur(8px);background: #0008;z-index: 1;">User-Defined Footer</div>
      </q-scroll-area>

      <q-scroll-area
        v-else
        key="scd"
        ref="scrollRef"
        style="width: 400px; height: 500px;"
        class="bg-dark text-white"
        :visible="alwaysVisible"
        dark
        :tabindex="focusable === true ? 0 : void 0"
      >
        <div :class="{ 'flex no-wrap' : horizontal }">
          <div style="margin-top: 150px" />
          <div style="margin-bottom: 25px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>
      </q-scroll-area>
    </keep-alive>

    <br>
    <q-btn @click="number--">
      Less
    </q-btn>
    <q-btn @click="number++">
      More
    </q-btn>
    <q-btn @click="scroll">
      Scroll to 125
    </q-btn>
    <q-btn @click="scroll2">
      Scroll to 525 (animated)
    </q-btn>
    <q-btn @click="scroll3">
      Scroll to 90%
    </q-btn>
    <q-btn @click="getInfo">
      getScroll()
    </q-btn>

    <q-separator spaced />
    <pre class="inline-block" dir="ltr">{{ scrollDetails }}</pre>
    <q-separator spaced />

    <div style="height: 100px" />

    <div class="row q-gutter-md">
      <q-scroll-area
        class="bg-yellow"
        style="width: 800px; height: 300px;"
        :visible="alwaysVisible"
        :bar-style="customBarStyle"
        :vertical-bar-style="customVBarStyle"
        :horizontal-bar-style="customHBarStyle"
        :thumbStyle="customThumbStyle"
        :vertical-thumb-style="customVThumbStyle"
        :horizontal-thumb-style="customHThumbStyle"
        :horizontal-offset="[topOffset, bottomOffset]"
      >
        <div v-if="topOffset" :style="`width: ${topOffset}px`" class="flex flex-center text-center text-white fixed-left" style="backdrop-filter: blur(8px);background: #0008;z-index: 1;">User-Defined Panel</div>

        <div class="flex no-wrap" :style="{
          'padding-left': topOffset ? ` ${topOffset}px` : void 0,
          'padding-right': bottomOffset ? ` ${bottomOffset}px` : void 0,
        }">
          <div style="margin: 12px; width: 300px" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>

        <div v-if="bottomOffset" :style="`width: ${bottomOffset}px`" class="flex flex-center text-center text-white fixed-right" style="backdrop-filter: blur(8px);background: #0008;z-index: 1;">User-Defined Panel</div>
      </q-scroll-area>
    </div>

    <div style="height: 100px" />

    <div class="row q-gutter-md">
      <q-scroll-area
        ref="scroll2"
        class="bg-yellow"
        style="width: 400px; height: 200px;"
        :visible="alwaysVisible"
        :bar-style="customBarStyle"
        :vertical-bar-style="customVBarStyle"
        :horizontal-bar-style="customHBarStyle"
        :thumbStyle="customThumbStyle"
        :vertical-thumb-style="customVThumbStyle"
        :horizontal-thumb-style="customHThumbStyle"
      >
        <div class="flex no-wrap">
          <div style="margin-top: 150px" />
          <div style="margin-bottom: 25px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>
        <div class="flex no-wrap">
          <div style="margin-top: 150px" />
          <div style="margin-bottom: 25px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>
        <div class="flex no-wrap">
          <div style="margin-top: 150px" />
          <div style="margin-bottom: 25px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>
        <div class="flex no-wrap">
          <div style="margin-top: 150px" />
          <div style="margin-bottom: 25px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>
      </q-scroll-area>

      <q-scroll-area
        class="bg-yellow"
        style="width: 40px; height: 40px;"
        :visible="alwaysVisible"
      >
        <div style="margin-bottom: 25px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
          {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </q-scroll-area>
    </div>

    <div style="height: 300px" />
  </div>
</template>

<script setup>
import { Lang } from 'quasar'
import { ref, computed } from 'vue'

let cnt = 0
let c = 0

const testComputed = computed(() => {
  c++
  return c
})

function testFx () {
  cnt++
  return cnt
}

const darkVariant = ref(false)
const number = ref(5)
const horizontal = ref(false)
const alwaysVisible = ref(true)
const customStyle = ref(false)
const focusable = ref(true)
const scrollDetails = ref(null)
const topOffset = ref(100)
const bottomOffset = ref(100)

const scrollRef = ref(null)

const axis = computed(() => {
  return horizontal.value === true ? 'horizontal' : 'vertical'
})

const customBarStyle = computed(() => {
  return customStyle.value === true
    ? {
        backgroundColor: '#666',
        borderStyle: 'solid',
        borderColor: 'transparent',
        backgroundClip: 'content-box'
      }
    : null
})
const customVBarStyle = computed(() => {
  return customStyle.value === true
    ? { borderWidth: '0 10px', width: '24px' }
    : null
})
const customHBarStyle = computed(() => {
  return customStyle.value === true
    ? { borderWidth: '10px 0', height: '24px' }
    : null
})

const customThumbStyle = computed(() => {
  return customStyle.value === true
    ? {
        backgroundColor: '#888',
        borderRadius: '7px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        backgroundClip: 'content-box'
      }
    : null
})
const customVThumbStyle = computed(() => {
  return customStyle.value === true
    ? { borderWidth: '0 2px', width: '24px' }
    : null
})
const customHThumbStyle = computed(() => {
  return customStyle.value === true
    ? { borderWidth: '2px 0', height: '24px' }
    : null
})

const scrollSign = computed(() => {
  console.log(Lang.props.rtl)
  return axis.value === 'horizontal' && Lang.props.rtl === true ? -1 : 1
})

function scroll () {
  scrollRef.value.setScrollPosition(axis.value, 125 * scrollSign.value)
}

function scroll2 () {
  scrollRef.value.setScrollPosition(axis.value, 525 * scrollSign.value, 1000)
}

function scroll3 () {
  scrollRef.value.setScrollPercentage(axis.value, 0.9, 1000)
}

function getInfo () {
  scrollDetails.value = {
    getScroll: scrollRef.value.getScroll(),
    getScrollPosition: scrollRef.value.getScrollPosition(),
    getScrollPercentage: scrollRef.value.getScrollPercentage()
  }
  console.log('getScroll()', scrollRef.value.getScroll())
  console.log('getScrollPosition()', scrollRef.value.getScrollPosition())
  console.log('getScrollPercentage()', scrollRef.value.getScrollPercentage())
}
</script>
