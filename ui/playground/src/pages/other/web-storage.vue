<template>
  <div class="q-layout-padding">
    <div>{{ storage }}</div>
    <q-btn-group>
      <q-btn label="Toggle test1" @click="toggle('test1')" />
      <q-btn label="Toggle test2" @click="toggle('test2')" />
      <q-btn label="Toggle test3" @click="toggle('test3')" />
      <q-btn label="Clear" @click="clear" />
    </q-btn-group>
  </div>
</template>

<script setup>
import { LocalStorage } from 'quasar'
import { nextTick, onMounted, ref } from 'vue'

const storage = ref(LocalStorage.getAll())

function toggle(key) {
  if (LocalStorage.has(key)) {
    LocalStorage.remove(key)
  } else {
    LocalStorage.set(key, `${key}-value`)
  }
  update()
}

function clear() {
  LocalStorage.clear()
  update()
}

function update() {
  storage.value = LocalStorage.getAll()
}

onMounted(() => {
  nextTick(() => {
    update()
  })
})
</script>
