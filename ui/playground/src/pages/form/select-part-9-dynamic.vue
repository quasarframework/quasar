<template>
  <div class="q-layout-padding column q-gutter-y-lg">
    <q-select
      style="width: 300px"
      v-model="multiple1"
      multiple
      :options="filteredOptions"
      filled
      behavior="menu"
      label="Multiple - Menu - google filters"
    />

    <q-select
      style="width: 300px"
      v-model="multiple1"
      multiple
      :options="filteredOptions"
      filled
      behavior="dialog"
      label="Multiple - Dialog - google filters"
    />

    <q-select
      style="width: 300px"
      v-model="multiple2"
      multiple
      :options="options"
      filled
      behavior="menu"
      label="Multiple - Menu - dynamic loading"
      :loading="loading"
      @virtual-scroll="onScroll"
    />

    <q-select
      style="width: 300px"
      v-model="multiple2"
      multiple
      :options="options"
      filled
      behavior="dialog"
      label="Multiple - Dialog - dynamic loading"
      :loading="loading"
      @virtual-scroll="onScroll"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'

const optionNames = ['Google', 'Twitter', 'Facebook', 'Apple', 'Oracle']
const allOptions = Array.from({ length: 100_000 }).reduce((acc, _, i) => {
  optionNames.forEach(n => {
    acc.push(`${n} - ${i}`)
  })
  return acc
}, [])
const pageSize = 50
const lastPage = Math.ceil(allOptions.length / pageSize)

const multiple1 = ref([])
const multiple2 = ref(null)

const nextPage = ref(2)
const loading = ref(false)

const filteredOptions = computed(() => {
  if (multiple1.value.some(x => x.includes('Google'))) {
    return allOptions.filter(
      x =>
        !x.includes('Twitter') && !x.includes('Apple') && !x.includes('Oracle')
    )
  }
  return allOptions
})

const options = computed(() =>
  allOptions.slice(0, pageSize * (nextPage.value - 1))
)

function onScroll({ to, ref: vmRef }) {
  const lastIndex = options.value.length - 1

  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    loading.value = true

    setTimeout(() => {
      nextPage.value++

      nextTick(() => {
        vmRef.refresh()
        loading.value = false
      })
    }, 500)
  }
}
</script>
