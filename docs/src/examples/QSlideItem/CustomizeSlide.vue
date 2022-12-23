<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>
      <q-slide-item
        :left-color="leftColor"
        :right-color="rightColor"
        @left="onLeft"
        @right="onRight"
        @slide="onSlide"
      >
        <template v-slot:left>
          Left
        </template>
        <template v-slot:right>
          Right content.. long
        </template>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar6.jpg" draggable="false">
            </q-avatar>
          </q-item-section>
          <q-item-section>Text only</q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, onBeforeUnmount } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    let timer

    const slideRatio = ref({
      left: 0,
      right: 0
    })

    const leftColor = computed(() => (
      slideRatio.value.left >= 1
        ? 'red-10'
        : 'red-' + (3 + Math.round(Math.min(3, slideRatio.value.left * 3)))
    ))

    const rightColor = computed(() => (
      slideRatio.value.right >= 1
        ? 'green-10'
        : 'green-' + (3 + Math.round(Math.min(3, slideRatio.value.right * 3)))
    ))

    function finalize (reset) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        reset()
      }, 1000)
    }

    onBeforeUnmount(() => {
      clearTimeout(timer)
    })

    return {
      leftColor,
      rightColor,

      onLeft ({ reset }) {
        $q.notify('Left action triggered. Resetting in 1 second.')
        finalize(reset)
      },

      onRight ({ reset }) {
        $q.notify('Right action triggered. Resetting in 1 second.')
        finalize(reset)
      },

      onSlide ({ side, ratio, isReset }) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          slideRatio.value[ side ] = ratio
        }, isReset === true ? 200 : void 0)
      }
    }
  }
}
</script>
