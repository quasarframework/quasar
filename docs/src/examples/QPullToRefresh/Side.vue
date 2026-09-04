<template>
  <div>
    <q-btn-toggle
      v-model="side"
      class="q-ma-md"
      no-caps
      push
      glossy
      toggle-color="primary"
      :options="sideOptions"
    />

    <q-separator />

    <div ref="scrollTargetRef" class="scroll" style="height: 220px">
      <q-pull-to-refresh :side="side" @refresh="refresh">
        <div class="no-wrap" :class="orientationClass">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="col-auto q-pa-md"
            style="width: 250px"
          >
            <q-badge color="secondary">
              {{ index + 1 }}
            </q-badge>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </div>
        </div>
      </q-pull-to-refresh>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'

const side = ref('top')
const sideOptions = ['top', 'bottom', 'left', 'right'].map(value => ({
  label: value,
  value
}))

const scrollTargetRef = useTemplateRef('scrollTargetRef')
const items = ref([{}, {}, {}, {}, {}, {}])
const orientationClass = computed(() =>
  side.value === 'top' || side.value === 'bottom' ? 'column' : 'row'
)

// the pull can only start while the content is scrolled to the chosen side
function scrollToSide() {
  const el = scrollTargetRef.value
  el.scrollTop = side.value === 'bottom' ? el.scrollHeight : 0
  el.scrollLeft = side.value === 'right' ? el.scrollWidth : 0
}

watch(side, scrollToSide)

function refresh(done) {
  setTimeout(() => {
    items.value.push({}, {})
    done()
    nextTick(scrollToSide)
  }, 1000)
}
</script>
