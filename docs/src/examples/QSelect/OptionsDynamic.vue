<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        multiple
        :options="options"
        :loading="loading"
        @virtual-scroll="onScroll"
      />
    </div>
  </div>
</template>

<script>
const options = []
for (let i = 0; i <= 100000; i++) {
  options.push('Opt ' + i)
}

const pageSize = 50
const nextPage = 2
const lastPage = Math.ceil(options.length / pageSize)

export default {
  data () {
    return {
      model: null,

      loading: false,

      nextPage
    }
  },

  computed: {
    options () {
      return Object.freeze(options.slice(0, pageSize * (this.nextPage - 1)))
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
