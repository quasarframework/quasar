<template>
  <div>
    <div ref="scrollTargetRef" class="q-pa-md" style="max-height: 250px; overflow: auto;">
      <q-infinite-scroll @load="onLoadRef" :offset="250" :scroll-target="scrollTargetRef">
        <div v-for="(item, index) in itemsRef" :key="index" class="caption">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>

    <q-separator style="height: 2px" />

    <div id="scroll-target-id" class="q-pa-md" style="max-height: 248px; overflow: auto;">
      <q-infinite-scroll @load="onLoadId" :offset="250" scroll-target="#scroll-target-id">
        <div v-for="(item, index) in itemsId" :key="index" class="caption">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const itemsRef = ref([ {}, {}, {}, {}, {}, {}, {} ])
    const itemsId = ref([ {}, {}, {}, {}, {}, {}, {} ])
    const scrollTargetRef = ref(null)

    return {
      itemsRef,
      itemsId,
      scrollTargetRef,

      onLoadRef (index, done) {
        setTimeout(() => {
          itemsRef.value.push({}, {}, {}, {}, {}, {}, {})
          done()
        }, 2000)
      },

      onLoadId (index, done) {
        setTimeout(() => {
          itemsId.value.push({}, {}, {}, {}, {}, {}, {})
          done()
        }, 2000)
      }
    }
  }
}
</script>
