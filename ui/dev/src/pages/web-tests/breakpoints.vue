<template>
  <div class="q-pa-md q-gutter-y-md">
    <div v-for="bp in breakpoints" :key="bp" class="row q-col-gutter-sm">
      <div class="col-4">
        <div class="fit q-pa-sm bg-grey-4 text-center">
          <template v-if="bp === 'xs'">
            N/A
          </template>
          <strong v-else :class="`lt-${ bp }`">
            lt-{{ bp }}
          </strong>
        </div>
      </div>
      <div class="col-4">
        <div class="fit q-pa-sm bg-grey-4 text-center">
          <strong :class="`${ bp }`">
            {{ bp }}
          </strong>
        </div>
      </div>
      <div class="col-4">
        <div class="fit q-pa-sm bg-grey-4 text-center">
          <template v-if="bp === 'xl'">
            N/A
          </template>
          <strong v-else :class="`gt-${ bp }`">
            gt-{{ bp }}
          </strong>
        </div>
      </div>
    </div>

    <div class="q-pa-sm" :class="`bg-${ color }`">
      Screen breakpoint: <strong>{{ w }}</strong>
      <br/>
      from <strong>{{ $q.screen.sizes[w] || 0 }}</strong> to <strong>{{ $q.screen.sizes[wNext] || 'Infinity' }}</strong>
      <br/>
      width: <strong>{{ $q.screen.width }}</strong>
    </div>
  </div>
</template>

<script>
const breakpoints = [ 'xs', 'sm', 'md', 'lg', 'xl' ]
const breakpointsLen = breakpoints.length

export default {
  data () {
    return {
      breakpoints
    }
  },

  computed: {
    w () {
      const { screen } = this.$q

      for (let i = 0; i < breakpointsLen; i++) {
        const bp = breakpoints[ i ]

        if (screen[ bp ] === true) {
          return bp
        }
      }

      return '???'
    },

    wNext () {
      const { screen } = this.$q

      for (let i = 0; i < breakpointsLen; i++) {
        const bp = breakpoints[ i ]

        if (screen[ bp ] === true) {
          return i < breakpointsLen - 1 ? breakpoints[ i + 1 ] : '???'
        }
      }

      return '???'
    },

    color () {
      const index = breakpoints.indexOf(this.w)

      return index === -1
        ? 'red-6'
        : `yellow-${ 1 + 2 * index }`
    }
  }
}
</script>
