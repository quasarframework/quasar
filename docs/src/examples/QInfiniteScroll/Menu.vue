<template>
  <div class="flex flex-center" style="height: 100px">
    <q-btn color="brown" label="Menu with QInfiniteScroll" no-caps>
      <q-menu
        anchor="bottom middle"
        self="top middle"
        :offset="[ 0, 8 ]"
      >
        <q-item-label header>
          Notifications
        </q-item-label>

        <q-separator />

        <q-list ref="scrollTargetRef" class="scroll" style="max-height: 250px">
          <q-infinite-scroll @load="onLoadMenu" :offset="250" :scroll-target="scrollTargetRef">
            <q-item v-for="(item, index) in itemsMenu" :key="index">
              <q-item-section>
                {{ index + 1 }}. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Rerum repellendus sit voluptate voluptas eveniet porro.
                Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
              </q-item-section>
            </q-item>

            <template v-slot:loading>
              <div class="text-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const itemsMenu = ref([ {}, {}, {}, {}, {}, {}, {} ])
    const scrollTargetRef = ref(null)

    return {
      itemsMenu,
      scrollTargetRef,

      onLoadMenu (index, done) {
        if (index > 1) {
          setTimeout(() => {
            itemsMenu.value.push({}, {}, {}, {}, {}, {}, {})
            done()
          }, 2000)
        }
        else {
          setTimeout(() => {
            done()
          }, 200)
        }
      }
    }
  }
}
</script>
