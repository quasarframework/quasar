<template>
  <q-virtual-scroll
    style="max-height: 300px; overflow-x: hidden"
    :items-size="size"
    :items-fn="getItems"
    :virtual-scroll-item-size="78"
    separator
  >
    <template v-slot="{ item, index }">
      <async-component :key="index" :index="item.index" :sent="item.sent"></async-component>
    </template>
  </q-virtual-scroll>
</template>

<script>
import { QChatMessage } from 'quasar'
import { h, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

const AsyncComponent = defineComponent({
  props: {
    index: Number,
    sent: Boolean
  },

  setup (props) {
    const asyncContent = ref(null)

    let timer

    onMounted(() => {
      timer = setTimeout(() => {
        asyncContent.value = {
          sent: props.sent,
          name: props.sent === true ? 'me' : 'Someone else',
          avatar: props.sent === true ? 'https://cdn.quasar.dev/img/avatar4.jpg' : 'https://cdn.quasar.dev/img/avatar3.jpg',
          stamp: `${Math.floor(props.index / 1000)} minutes ago`,
          text: [`Message with id ${props.index}`]
        }
      }, 300 + Math.random() * 2000)
    })

    onBeforeUnmount(() => {
      clearTimeout(timer)
    })

    return () => h(QChatMessage, {
      class: 'q-mx-sm',
      ...(asyncContent.value === null
        ? {
            sent: props.sent,
            text: [`Retrieving message ${props.index}`]
          }
        : asyncContent.value)
    })
  }
})

export default {
  components: {
    AsyncComponent
  },

  setup () {
    const size = ref(100000)

    return {
      size,

      getItems (from, size) {
        const items = []

        for (let i = 0; i < size; i++) {
          items.push({
            index: size - from - i,
            sent: Math.random() > 0.5
          })
        }

        return Object.freeze(items)
      }
    }
  }
}
</script>
