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
import { h, defineComponent, toRefs, ref, onMounted, onBeforeUnmount } from 'vue'

const AsyncComponent = defineComponent({
  props: {
    index: Number,
    sent: Boolean
  },

  setup (props) {
    const { sent, index } = toRefs(props)
    const asyncContent = ref(null)

    let timer

    onMounted(() => {
      timer = setTimeout(() => {
        asyncContent.value = {
          sent: sent.value,
          name: sent.value === true ? 'me' : 'Someone else',
          avatar: sent.value === true ? 'https://cdn.quasar.dev/img/avatar4.jpg' : 'https://cdn.quasar.dev/img/avatar3.jpg',
          stamp: `${Math.floor(index.value / 1000)} minutes ago`,
          text: [`Message with id ${index.value}`]
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
            sent: sent.value,
            text: [`Retrieving message ${index.value}`]
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
