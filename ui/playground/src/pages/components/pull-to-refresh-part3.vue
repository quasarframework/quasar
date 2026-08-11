<template>
  <q-pull-to-refresh @refresh="load">
    <q-list
      style="width: 100%; height: 300px; border: 1px solid red"
      class="scroll-y"
      @touchstart="preventPull"
      @mousedown="preventPull"
    >
      <q-item v-for="i in list" clickable v-ripple :key="i">
        {{ i }}
      </q-item>
    </q-list>
  </q-pull-to-refresh>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

defineOptions({ name: 'Test' })

const $q = useQuasar()

const list = ref(['Pull down to load elements'])

function load(done) {
  const base = list.value.length
  for (let i = 0; i < 10; i++) {
    list.value.push(base + i)
  }
  done()
}

function preventPull(e) {
  let parent = e.target

  while (parent !== void 0 && !parent.classList.contains('scroll-y')) {
    parent = parent.parentNode
  }

  if (parent !== void 0 && parent.scrollTop > 0) {
    if ($q.platform.is.desktop) {
      console.log('prevent!')
    } else {
      $q.notify('prevent!')
    }
    e.stopPropagation()
  }
}
</script>
