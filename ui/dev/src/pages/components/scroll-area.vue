<template>
  <div class="q-layout-padding">
    <q-toggle v-model="horizontal" label="Horizontal content" />
    <q-toggle v-model="customStyle" label="Custom style" />
    <q-toggle v-model="alwaysVisible" toggle-indeterminate label="Always visible" />
    <q-toggle v-model="darkVariant" toggle-indeterminate label="Dark variant" />
    <q-toggle v-model="focusable" label="Focusable" />

    <div class="row items-center">
      <div class="q-mr-md">
        <div>Top offset</div>
        <q-slider v-model="topOffset" :min="0" :max="100" label-always switch-label-side style="width: 200px"/>
      </div>

      <div>
        <div>Bottom offset</div>
        <q-slider v-model="bottomOffset" :min="0" :max="100" label-always switch-label-side style="width: 200px"/>
      </div>
    </div>

    <div style="height: 50px;" />

    <keep-alive>
      <q-scroll-area
        v-if="!darkVariant"
        key="scl"
        ref="scroll"
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
        <div v-if="topOffset" :style="`height: ${topOffset}px`" class="flex flex-center text-white fixed-top" style="backdrop-filter: blur(8px);background: #0008;z-index: 1;">User-Defined Header</div>

        <div :class="{ 'flex no-wrap' : horizontal }" :style="{
          'padding-top': topOffset ? ` ${topOffset}px` : void 0,
          'padding-bottom': bottomOffset ? ` ${bottomOffset}px` : void 0,
        }">
          <div style="margin-block: 12px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>

        <div v-if="bottomOffset" :style="`height: ${bottomOffset}px`" class="flex flex-center text-white fixed-bottom" style="backdrop-filter: blur(8px);background: #0008;z-index: 1;">User-Defined Footer</div>
      </q-scroll-area>

      <q-scroll-area
        v-else
        key="scd"
        ref="scroll"
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

<script>
export default {
  data () {
    return {
      darkVariant: false,
      number: 5,
      horizontal: false,
      alwaysVisible: true,
      customStyle: false,
      focusable: true,
      scrollDetails: null,
      topOffset: 100,
      bottomOffset: 100
    }
  },

  computed: {
    axis () {
      return this.horizontal === true ? 'horizontal' : 'vertical'
    },

    customBarStyle () {
      return this.customStyle === true
        ? {
            backgroundColor: '#666',
            borderStyle: 'solid',
            borderColor: 'transparent',
            backgroundClip: 'content-box'
          }
        : null
    },
    customVBarStyle () {
      return this.customStyle === true
        ? { borderWidth: '0 10px', width: '24px' }
        : null
    },
    customHBarStyle () {
      return this.customStyle === true
        ? { borderWidth: '10px 0', height: '24px' }
        : null
    },

    customThumbStyle () {
      return this.customStyle === true
        ? {
            backgroundColor: '#888',
            borderRadius: '7px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            backgroundClip: 'content-box'
          }
        : null
    },
    customVThumbStyle () {
      return this.customStyle === true
        ? { borderWidth: '0 2px', width: '24px' }
        : null
    },
    customHThumbStyle () {
      return this.customStyle === true
        ? { borderWidth: '2px 0', height: '24px' }
        : null
    },

    scrollSign () {
      return this.axis === 'horizontal' && this.$q.lang.rtl === true ? -1 : 1
    }
  },

  methods: {
    scroll () {
      this.$refs.scroll.setScrollPosition(this.axis, 125 * this.scrollSign)
    },
    scroll2 () {
      this.$refs.scroll.setScrollPosition(this.axis, 525 * this.scrollSign, 1000)
    },
    scroll3 () {
      this.$refs.scroll.setScrollPercentage(this.axis, 0.9, 1000)
    },
    getInfo () {
      this.scrollDetails = {
        getScroll: this.$refs.scroll.getScroll(),
        getScrollPosition: this.$refs.scroll.getScrollPosition(),
        getScrollPercentage: this.$refs.scroll.getScrollPercentage()
      }
      console.log('getScroll()', this.$refs.scroll.getScroll())
      console.log('getScrollPosition()', this.$refs.scroll.getScrollPosition())
      console.log('getScrollPercentage()', this.$refs.scroll.getScrollPercentage())
    }
  }
}
</script>
