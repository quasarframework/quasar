<template>
  <q-pull-to-refresh @refresh="load">
    <q-list style="width: 100%; height: 300px; border: 1px solid red;" class="scroll-y" @touchstart="preventPull" @mousedown="preventPull">
      <q-item v-for="i in list" clickable v-ripple :key="i">
        {{ i }}
      </q-item>
    </q-list>
  </q-pull-to-refresh>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      list: [ 'Pull down to load elements' ]
    }
  },
  methods: {
    load (done) {
      const base = this.list.length
      for (let i = 0; i < 10; i++) {
        this.list.push(base + i)
      }
      done()
    },

    preventPull (e) {
      let parent = e.target

      while (parent !== void 0 && !parent.classList.contains('scroll-y')) {
        parent = parent.parentNode
      }

      if (parent !== void 0 && parent.scrollTop > 0) {
        if (this.$q.platform.is.desktop) {
          console.log('prevent!')
        }
        else {
          this.$q.notify('prevent!')
        }
        e.stopPropagation()
      }
    }
  }
}
</script>
