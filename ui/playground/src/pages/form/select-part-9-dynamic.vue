<template>
  <div class="q-layout-padding column q-gutter-y-lg">
    <q-select
      style="width: 300px"
      v-model="multiple1"
      multiple
      :options="filteredOptions"
      filled
      behavior="menu"
      label="Multiple - Menu - google filters"
    />

    <q-select
      style="width: 300px"
      v-model="multiple1"
      multiple
      :options="filteredOptions"
      filled
      behavior="dialog"
      label="Multiple - Dialog - google filters"
    />

    <q-select
      style="width: 300px"
      v-model="multiple2"
      multiple
      :options="options"
      filled
      behavior="menu"
      label="Multiple - Menu - dynamic loading"
      :loading="loading"
      @virtual-scroll="onScroll"
    />

    <q-select
      style="width: 300px"
      v-model="multiple2"
      multiple
      :options="options"
      filled
      behavior="dialog"
      label="Multiple - Dialog - dynamic loading"
      :loading="loading"
      @virtual-scroll="onScroll"
    />
  </div>
</template>

<script>
const optionNames = [ 'Google', 'Twitter', 'Facebook', 'Apple', 'Oracle' ]
const options = Array(100000).fill(null).reduce((acc, _, i) => {
  optionNames.forEach(n => {
    acc.push(`${ n } - ${ i }`)
  })
  return acc
}, [])
const pageSize = 50
const lastPage = Math.ceil(options.length / pageSize)

export default {
  data: () => ({
    multiple1: [],
    multiple2: null,

    nextPage: 2,
    loading: false

  }),

  computed: {
    filteredOptions () {
      if (this.multiple1.some(x => x.indexOf('Google') > -1)) {
        return options.filter(x => x.indexOf('Twitter') === -1 && x.indexOf('Apple') === -1 && x.indexOf('Oracle') === -1)
      }
      return options
    },

    options () {
      return options.slice(0, pageSize * (this.nextPage - 1))
    }
  },

  methods: {
    onScroll ({ to, ref }) {
      const lastIndex = this.options.length - 1

      if (this.loading !== true && this.nextPage < lastPage && to === lastIndex) {
        this.loading = true

        setTimeout(() => {
          this.nextPage++

          this.$nextTick(() => {
            ref.refresh()
            this.loading = false
          })
        }, 500)
      }
    }
  }
}
</script>
