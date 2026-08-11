<template>
  <div class="q-layout-padding">
    <div class="q-text-caption text-weight-bold">KeepAlive - Options API</div>
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstOpt" />
      <div>Show first</div>
    </label>

    <keep-alive>
      <keep-alive-test-opt
        v-if="showFirstOpt"
        name="first"
        @log="t => log(0, t)"
      />
      <keep-alive-test-opt v-else name="second" @log="t => log(0, t)" />
    </keep-alive>

    <q-separator class="q-my-md" />

    <div class="q-text-caption text-weight-bold"
      >KeepAlive - Composition API</div
    >
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstComp" />
      <div>Show first</div>
    </label>

    <keep-alive>
      <keep-alive-test-comp
        v-if="showFirstComp"
        name="first"
        @log="t => log(1, t)"
      />
      <keep-alive-test-comp v-else name="second" @log="t => log(1, t)" />
    </keep-alive>

    <q-separator class="q-my-lg" />

    <div class="q-text-caption text-weight-bold"
      >NO KeepAlive - Options API</div
    >
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstNoKeepOpt" />
      <div>Show first</div>
    </label>

    <keep-alive-test-opt
      v-if="showFirstNoKeepOpt"
      name="first"
      @log="t => log(2, t)"
    />
    <keep-alive-test-opt v-else name="second" @log="t => log(2, t)" />

    <q-separator class="q-my-md" />

    <div class="q-text-caption text-weight-bold"
      >NO KeepAlive - Composition API</div
    >
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstNoKeepComp" />
      <div>Show first</div>
    </label>

    <keep-alive-test-comp
      v-if="showFirstNoKeepComp"
      name="first"
      @log="t => log(3, t)"
    />
    <keep-alive-test-comp v-else name="second" @log="t => log(3, t)" />

    <q-separator class="q-my-lg" />

    <div class="row items-start q-gutter-md">
      <div v-for="(log, i) in logs" :key="i" class="col">
        <div class="q-text-caption text-weight-bold">{{ logNames[i] }}</div>
        <div v-for="(text, j) in log" :key="j">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  h,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref
} from 'vue'

const KeepAliveTestOpt = {
  name: 'KeepAliveTestOptionsAPI',

  props: {
    name: String
  },

  emits: ['log'],

  created() {
    this.log('created')
  },

  beforeMount() {
    this.log('beforeMount')
  },

  mounted() {
    this.log('mounted')
  },

  activated() {
    this.log('activated')
  },

  deactivated() {
    this.log('deactivated')
  },

  beforeUnmount() {
    this.log('beforeUnmount')
  },

  unmounted() {
    this.log('unmounted')
  },

  methods: {
    log(what) {
      this.$emit('log', `[${this.name}] ${what}`)
    }
  },

  render() {
    return h('div', ['keep alive test ' + this.name])
  }
}

const KeepAliveTestComp = {
  props: {
    name: String
  },

  emits: ['log'],

  setup(props, { emit }) {
    const logEvent = what => {
      emit('log', `[${props.name}] ${what}`)
    }

    logEvent('created')
    onBeforeMount(() => {
      logEvent('onBeforeMount')
    })
    onMounted(() => {
      logEvent('onMounted')
    })
    onActivated(() => {
      logEvent('onActivated')
    })
    onDeactivated(() => {
      logEvent('onDeactivated')
    })
    onBeforeUnmount(() => {
      logEvent('onBeforeUnmount')
    })
    onUnmounted(() => {
      logEvent('onUnmounted')
    })

    return () => h('div', ['keep alive test ' + props.name])
  }
}

const showFirstOpt = ref(true)
const showFirstComp = ref(true)

const showFirstNoKeepOpt = ref(true)
const showFirstNoKeepComp = ref(true)

const logs = ref(Array.from({ length: 4 }, () => []))
const logNames = ref([
  'KeepAlive - Options API',
  'KeepAlive - Composition API',
  'NO KeepAlive - Options API',
  'NO KeepAlive - Composition API'
])

// the rendered log only records events after mount: the children's
// creation events also fire during the server render and during
// hydration, where recording them would desync the two passes
const ready = ref(false)

onMounted(() => {
  ready.value = true
})

function log(i, text) {
  if (ready.value === false) {
    return
  }

  logs.value[i].push(text)
}
</script>
