<template>
  <q-virtual-scroll
    style="max-height: 300px;"
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
</template>

<script>
const maxSize = 10000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1)
  })
}

export default {
  setup () {
    return {
      heavyList
    }
  }
}
</script>
