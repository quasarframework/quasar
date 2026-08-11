<template>
  <div>
    <div class="q-layout-padding">
      <q-toggle label="Vertical" v-model="vertical" />
      <q-toggle label="Animated" v-model="animated" />
      <q-toggle label="Swipeable" v-model="swipeable" />
      <q-toggle label="Alternative Labels" v-model="alt" />
      <q-toggle label="Contracted" v-model="contracted" />
      <q-toggle label="Header Navigation" v-model="headerNav" />
      <q-toggle label="Use 'header-nav' on steps" v-model="headerNavStep" />
      <q-toggle label="Flat" v-model="flat" />
      <q-toggle label="Bordered" v-model="bordered" />
      <q-toggle label="Dark" v-model="dark" :false-value="null" />

      <q-toggle label="Global Navigation" v-model="globalNav" />
      <q-toggle label="Caption" v-model="caption" />
      <q-toggle label="Prefix" v-model="prefix" />
      <q-toggle label="No active icon" v-model="noActiveIcon" />
      <q-toggle label="No error icon" v-model="noErrorIcon" />
      <q-toggle label="No done icon" v-model="noDoneIcon" />
      <q-toggle label="Use 'done' prop" v-model="useDone" />

      <q-toggle label="Step 4 disable" v-model="stepDisable" />

      <q-toggle label="Keep alive" v-model="keepAlive" />

      <q-toggle label="Custom Header Class" v-model="customHeaderClass" />

      <q-btn label="One" @click="step = 1" />
      <q-btn label="Two" @click="step = 2" />

      <q-stepper
        :class="'q-mt-lg' + (dark ? ' bg-black' : '')"
        :vertical="vertical"
        :animated="animated"
        :swipeable="swipeable"
        :dark="dark"
        :flat="flat"
        :bordered="bordered"
        :header-nav="headerNav"
        :active-icon="noActiveIcon ? 'none' : void 0"
        :error-icon="noErrorIcon ? 'none' : void 0"
        :done-icon="noDoneIcon ? 'none' : void 0"
        :color="color"
        ref="stepper"
        v-model="step"
        :keep-alive="keepAlive"
        :alternative-labels="alt"
        :contracted="contracted && !vertical"
        :header-class="customHeaderClass ? 'text-bold' : void 0"
      >
        <q-step
          :name="1"
          :prefix="prefix ? 1 : ''"
          :done="useDone && step > 1"
          :header-nav="headerNavStep ? step > 1 : true"
          title="Ad style"
          icon="map"
          :caption="caption ? 'Some caption' : null"
        >
          <q-input v-model="myInput" />
          <div>{{ myInput || 'null' }}</div>
          <keep-alive-test name="one" />
          <q-date v-model="date" />
          <q-fab color="purple" icon="keyboard_arrow_up" direction="up">
            <q-fab-action color="amber" icon="alarm" />
            <q-fab-action color="amber" icon="alarm" />
            <q-fab-action color="amber" icon="alarm" />
          </q-fab>
          <q-btn dense round icon="map" class="absolute-top-right" />

          <input v-model="myInput" />
          <q-uploader
            multiple
            label="Multiple"
            url="http://localhost:4444/upload"
          />
          <div v-for="n in 10" :key="'1.' + n">{{ n }} Step 1</div>
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">
              Continue
            </q-btn>
            <q-btn :color="color" @click="step = 5" class="q-ml-sm">
              Go to Step 5
            </q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          :prefix="prefix ? 2 : ''"
          :done="useDone && step > 2"
          :header-nav="headerNavStep ? step > 2 : true"
          error
          title="Custom channels"
          :caption="caption ? 'Alert message' : null"
          icon="map"
        >
          <div v-for="n in 10" :key="'2.' + n">{{ n }} Step 2</div>
          <keep-alive-test name="two" />
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">
              Continue
            </q-btn>
            <q-btn
              :color="color"
              flat
              @click="$refs.stepper.previous()"
              class="q-ml-sm"
            >
              Back
            </q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          :prefix="prefix ? 3 : ''"
          done-color="orange"
          :done="useDone && step > 3"
          :header-nav="headerNavStep ? step > 3 : true"
          title="Get code"
          icon="map"
        >
          <div v-for="n in 3" :key="'3.' + n">{{ n }} Step 3</div>
          <keep-alive-test name="three" />
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">
              Continue
            </q-btn>
            <q-btn
              :color="color"
              flat
              @click="$refs.stepper.previous()"
              class="q-ml-sm"
            >
              Back
            </q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="4"
          :prefix="prefix ? 4 : ''"
          :done="useDone && step > 4"
          :header-nav="headerNavStep ? step > 4 : true"
          :disable="stepDisable"
          title="Disabled"
          icon="map"
        >
          <div v-for="n in 3" :key="'4.' + n">{{ n }} Step 4</div>
          <keep-alive-test name="four" />
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">
              Continue
            </q-btn>
            <q-btn
              :color="color"
              flat
              @click="$refs.stepper.previous()"
              class="q-ml-sm"
            >
              Back
            </q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="5"
          :prefix="prefix ? 5 : ''"
          title="Wrap up"
          :header-nav="headerNavStep ? step > 5 : true"
          icon="map"
        >
          <div v-for="n in 3" :key="'5.' + n">{{ n }} Step 5</div>
          <keep-alive-test name="five" />
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="step = 1"> Restart </q-btn>
            <q-btn
              :color="color"
              flat
              @click="$refs.stepper.previous()"
              class="q-ml-sm"
            >
              Back
            </q-btn>
          </q-stepper-navigation>
        </q-step>

        <template v-slot:message>
          <div class="q-pa-lg">Message slot</div>
        </template>

        <template v-if="globalNav" v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              :disable="step === 5"
              :color="color"
              @click="$refs.stepper.next()"
            >
              Continue
            </q-btn>
            <q-btn
              v-if="step !== 1"
              flat
              @click="$refs.stepper.previous()"
              class="q-ml-sm"
            >
              Back
            </q-btn>
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </div>
</template>

<script setup>
import { h, onMounted, ref, watch } from 'vue'

const KeepAliveTest = {
  name: 'KeepAliveTest',

  props: {
    name: String
  },

  created() {
    this.log('created')
  },

  beforeMount() {
    this.log('beforeMount')
  },

  mounted() {
    this.log('mounted')
  },

  beforeUnmount() {
    this.log('beforeUnmount')
  },

  unmounted() {
    this.log('unmounted')
  },

  methods: {
    log(what) {
      console.log(`[KeepAliveTest > ${this.name}] ${what}`)
    }
  },

  render() {
    return h('div', 'keep alive test ' + this.name)
  }
}

const stepper = ref(null)

const color = ref('primary')
const myInput = ref('')
const date = ref(null)

const stepDisable = ref(true)

const step = ref(1)
const vertical = ref(false)
const animated = ref(true)
const swipeable = ref(true)
const alt = ref(false)
const contracted = ref(false)
const headerNav = ref(true)
const flat = ref(false)
const bordered = ref(false)
const dark = ref(null)

const globalNav = ref(false)
const caption = ref(false)
const prefix = ref(false)
const noActiveIcon = ref(false)
const noErrorIcon = ref(false)
const noDoneIcon = ref(false)
const useDone = ref(false)
const headerNavStep = ref(false)

const keepAlive = ref(true)

const customHeaderClass = ref(false)

watch(dark, v => {
  color.value = v ? 'deep-orange' : 'primary'
})

onMounted(() => {
  window.x = stepper.value
})
</script>
