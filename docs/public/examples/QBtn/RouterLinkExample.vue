<template>
  <div class="q-pa-md column q-gutter-sm">
    <router-link
      :to="{ hash: '#Handling-links' }"
      custom
      v-slot:default="props"
    >
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link
      :to="{ hash: '#Handling-links', query: { search: '1' } }"
      custom
      v-slot:default="props"
    >
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link
      :to="{ hash: '#Handling-links', query: { search: '1', test: '1' } }"
      custom
      v-slot:default="props"
    >
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link
      :to="{ hash: '#Handling-links', query: { search: '1', test: '2' } }"
      custom
      v-slot:default="props"
    >
      <q-btn v-bind="buttonProps(props)" />
    </router-link>

    <router-link
      :to="{ hash: '#Handling-links', query: { search: '1', test: '1' } }"
      custom
      v-slot:default="props"
    >
      <q-btn v-bind="buttonProps(props)" icon-right="timer_3" @click="linkClick" />
    </router-link>
  </div>
</template>

<script>
export default {
  setup () {
    function linkClick (e, go) {
      e.preventDefault() // we choose when we navigate

      // console.log('triggering navigation in 3s')
      setTimeout(() => {
        // console.log('navigating as promised 3s ago')
        go()
      }, 3000)
    }

    function buttonProps ({ href, route, isActive, isExactActive }) {
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

    return {
      linkClick,
      buttonProps
    }
  }
}
</script>
