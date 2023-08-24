<template>
  <div ref="virtualListScrollTargetRef" class="scroll" style="max-height: 230px">
    <div class="q-pa-md bg-purple text-white">
      Above the list - scrolls with the list
    </div>

    <q-virtual-scroll
      :scroll-target="scrollTarget"
      :items="heavyList"
      separator
      v-slot="{ item, index }"
    >
      <q-item
        :key="index"
        dense
      >
        <q-item-section>
          <q-item-label>
            #{{ index }} - {{ item.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-virtual-scroll>

    <div class="q-pa-md bg-purple text-white">
      Below the list - scrolls with the list
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

const maxSize = 10000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1)
  })
}

Object.freeze(heavyList)

export default {
  setup () {
    const virtualListScrollTargetRef = ref(null)
    const scrollTarget = ref(null)

    onMounted(() => {
      scrollTarget.value = virtualListScrollTargetRef.value
    })

    return {
      heavyList,
      virtualListScrollTargetRef,
      scrollTarget
    }
  }
}
</script>
