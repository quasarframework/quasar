<template>
  <div class="q-ma-lg">
    <div class="q-my-sm">
      <q-input ref="focus_1" v-model="text" />
    </div>
    <div class="q-my-sm">
      <input ref="focus_2" v-model="text">
    </div>

    <div class="q-gutter-md">
      <q-btn color="primary" label="Focus QInput" @click="() => focus(1)" />
      <q-btn color="primary" label="Focus Input" @click="() => focus(2)" />
      <q-btn color="primary" label="Do nothing" />
      <q-btn color="primary" label="Link" :to="`/components/focus-tests#${index}`" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      index: 1
    }
  },
  watch: {
    '$route' () {
      this.index += 1
    }
  },
  methods: {
    focus (index) {
      const el = this.$refs[ `focus_${ index }` ]
      el !== void 0 && el.focus()
    }
  }
}
</script>
