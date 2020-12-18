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
import { QChatMessage, QSkeleton } from 'quasar'
import { h, defineComponent, ref, onBeforeMount, onBeforeUnmount } from 'vue'

const AsyncComponent = defineComponent({
  props: {
    index: Number,
    sent: Boolean
  },

  setup (props) {
    const asyncContent = ref(null)

    let timer

    onBeforeMount(() => {
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

    return () => {
      if (asyncContent.value === Object(asyncContent.value)) {
        return h(QChatMessage, {
          class: 'q-mx-sm',
          key: props.index,
          ...asyncContent.value
        })
      }

      const content = [
        h(QSkeleton, {
          class: 'on-left on-right',
          animation: 'none',
          type: 'text',
          width: '150px',
          height: '100px'
        })
      ]

      content[ props.sent === true ? 'push' : 'unshift' ](
        h(QSkeleton, {
          animation: 'none',
          type: 'QAvatar'
        })
      )

      return h('div', {
        class: `row no-wrap items-center q-mx-sm justify-${props.sent === true ? 'end' : 'start'}`,
        style: 'height: 78px',
        key: props.index
      }, content)
    }
  }
})

const size = ref(100000)
const allItems = Array(size.value).fill(null).map((_, index) => ({
  index,
  sent: Math.random() > 0.5
}))

export default {
  components: {
    AsyncComponent
  },

  setup () {
    return {
      size,

      getItems (from, size) {
        const items = []

        for (let i = 0; i < size; i++) {
          items.push(allItems[ from + i ])
        }

        return Object.freeze(items)
      }
    }
  }
}
</script>
