<template>
  <div class="q-layout-padding">
    <div class="q-text-caption text-weight-bold">KeepAlive - Options API</div>
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstOpt" />
      <div>Show first</div>
    </label>

    <keep-alive>
      <keep-alive-test-opt v-if="showFirstOpt" name="first" @log="t => log(0, t)" />
      <keep-alive-test-opt v-else name="second" @log="t => log(0, t)" />
    </keep-alive>

    <q-separator class="q-my-md" />

    <div class="q-text-caption text-weight-bold">KeepAlive - Composition API</div>
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstComp" />
      <div>Show first</div>
    </label>

    <keep-alive>
      <keep-alive-test-comp v-if="showFirstComp" name="first" @log="t => log(1, t)" />
      <keep-alive-test-comp v-else name="second" @log="t => log(1, t)" />
    </keep-alive>

    <q-separator class="q-my-lg" />

    <div class="q-text-caption text-weight-bold">NO KeepAlive - Options API</div>
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstNoKeepOpt" />
      <div>Show first</div>
    </label>

    <keep-alive-test-opt v-if="showFirstNoKeepOpt" name="first" @log="t => log(2, t)" />
    <keep-alive-test-opt v-else name="second" @log="t => log(2, t)" />

    <q-separator class="q-my-md" />

    <div class="q-text-caption text-weight-bold">NO KeepAlive - Composition API</div>
    <label class="row items-center q-gutter-x-sm cursor-pointer">
      <div>Show second</div>
      <q-toggle v-model="showFirstNoKeepComp" />
      <div>Show first</div>
    </label>

    <keep-alive-test-comp v-if="showFirstNoKeepComp" name="first" @log="t => log(3, t)" />
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

<script>
import { h, onBeforeMount, onMounted, onActivated, onDeactivated, onBeforeUnmount, onUnmounted } from 'vue'

export default {
  components: {
    KeepAliveTestOpt: {
      name: 'KeepAliveTestOptionsAPI',

      props: {
        name: String
      },

      emits: [ 'log' ],

      created () {
        this.log('created')
      },

      beforeMount () {
        this.log('beforeMount')
      },

      mounted () {
        this.log('mounted')
      },

      activated () {
        this.log('activated')
      },

      deactivated () {
        this.log('deactivated')
      },

      beforeUnmount () {
        this.log('beforeUnmount')
      },

      unmounted () {
        this.log('unmounted')
      },

      methods: {
        log (what) {
          this.$emit('log', `[${ this.name }] ${ what }`)
        }
      },

      render () {
        return h('div', [ 'keep alive test ' + this.name ])
      }
    },

    KeepAliveTestComp: {
      props: {
        name: String
      },

      emits: [ 'log' ],

      setup (props, { emit }) {
        const log = what => {
          emit('log', `[${ props.name }] ${ what }`)
        }

        log('created')
        onBeforeMount(() => { log('onBeforeMount') })
        onMounted(() => { log('onMounted') })
        onActivated(() => { log('onActivated') })
        onDeactivated(() => { log('onDeactivated') })
        onBeforeUnmount(() => { log('onBeforeUnmount') })
        onUnmounted(() => { log('onUnmounted') })

        return () => h('div', [ 'keep alive test ' + props.name ])
      }
    }
  },

  data () {
    return {
      showFirstOpt: true,
      showFirstComp: true,

      showFirstNoKeepOpt: true,
      showFirstNoKeepComp: true,

      logs: Array(4).fill(null).map(_ => ([])),
      logNames: [
        'KeepAlive - Options API',
        'KeepAlive - Composition API',
        'NO KeepAlive - Options API',
        'NO KeepAlive - Composition API'
      ]
    }
  },

  methods: {
    log (i, text) {
      this.logs[ i ].push(text)
    }
  }
}
</script>
