<template>
  <q-virtual-scroll
    style="max-height: 300px; overflow-x: hidden"
    :items-size="size"
    :items-fn="getItems"
    :virtual-scroll-item-size="78"
    separator
  >
    <template v-slot="{ item, index }">
      <async-component :key="index" :index="item.index" :sent="item.sent" />
    </template>
  </q-virtual-scroll>
</template>

<script>
export default {
  components: {
    asyncComponent: {
      props: {
        index: Number,
        sent: Boolean
      },

      data () {
        return {
          asyncContent: null
        }
      },

      mounted () {
        this.timer = setTimeout(() => {
          this.asyncContent = {
            sent: this.sent,
            name: this.sent === true ? 'me' : 'Someone else',
            avatar: this.sent === true ? 'https://cdn.quasar.dev/img/avatar4.jpg' : 'https://cdn.quasar.dev/img/avatar3.jpg',
            stamp: `${Math.floor(this.index / 1000)} minutes ago`,
            text: [`Message with id ${this.index}`]
          }
        }, 300 + Math.random() * 2000)
      },

      beforeDestroy () {
        clearTimeout(this.timer)
      },

      render (h) {
        return h('q-chat-message', {
          staticClass: 'q-mx-sm',
          props: this.asyncContent === null
            ? {
              sent: this.sent,
              text: [`Retrieving message ${this.index}`]
            }
            : this.asyncContent
        })
      }
    }
  },

  data () {
    return {
      size: 100000
    }
  },

  methods: {
    getItems (from, size) {
      const items = []

      for (let i = 0; i < size; i++) {
        items.push({
          index: this.size - from - i,
          sent: Math.random() > 0.5
        })
      }

      return Object.freeze(items)
    }
  }
}
</script>
