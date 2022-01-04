<template>
  <div class="q-ma-md">
    Last item should be: {{ count - 1 }}

    <q-scroll-area style="height: 320px; min-width: 350px; max-width: 380px;" ref="scroll">
      <q-chat-message v-for="m in messages" :key="m.id" :text="[m.text]"></q-chat-message>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: Array(20).fill(null).map((_, id) => ({ id, text: 'message ' + id }))
    }
  },

  computed: {
    count () {
      return this.messages.length
    }
  },
  methods: {
    scrollDown () {
      setTimeout(() => {
        this.$refs.scroll.setScrollPercentage('vertical', 1)
      })
    }
  },
  watch: {
    count () {
      this.scrollDown()
    }
  },
  mounted () {
    this.scrollDown()

    this.timer = setInterval(() => {
      const id = this.messages.length

      this.messages = [
        ...this.messages,
        { id, text: 'New message ' + id }
      ]
    }, 2000)
  },

  beforeUnmount () {
    clearInterval(this.timer)
  }
}
</script>
