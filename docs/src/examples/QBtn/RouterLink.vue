<template>
  <div class="q-pa-md column q-gutter-sm">
    <router-link :to="{ hash: '#Using-as-scoped-slot-of-RouterLink-v3.1.0%2B' }" v-slot="props">
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link :to="{ hash: '#Using-as-scoped-slot-of-RouterLink-v3.1.0%2B', query: { search: '1' } }" v-slot="props">
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link :to="{ hash: '#Using-as-scoped-slot-of-RouterLink-v3.1.0%2B', query: { search: '1', test: '1' } }" v-slot="props">
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link :to="{ hash: '#Using-as-scoped-slot-of-RouterLink-v3.1.0%2B', query: { search: '1', test: '2' } }" v-slot="props">
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link :to="{ hash: '#Using-as-scoped-slot-of-RouterLink-v3.1.0%2B', query: { search: '1', test: '1' } }" v-slot="props">
      <q-btn v-bind="buttonProps(props)" icon-right="timer_3" @click="linkClick" />
    </router-link>
  </div>
</template>

<script>
export default {
  methods: {
    linkClick (e, go) {
      e.navigate = false // we choose when we navigate

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 3000)
    },

    buttonProps ({ href, route, isActive, isExactActive }) {
      const props = {
        color: 'black',
        noCaps: true,
        label: `To "${route.fullPath}"`,
        outline: true,
        to: href
      }

      if (isActive === true) {
        props.color = isExactActive === true ? 'primary' : 'amber-9'
      }
      else {
        props.color = 'black'
      }

      return props
    }
  }
}
</script>
