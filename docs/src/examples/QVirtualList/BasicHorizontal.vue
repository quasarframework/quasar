<template>
  <div class="q-pa-md">
    <q-virtual-list
      :items="heavyList"
      virtual-list-horizontal
    >
      <template v-slot="{ item, index }">
        <div
          :key="index"
          :class="item.class"
        >
          #{{ index }} - {{ item.label }}
        </div>
      </template>
    </q-virtual-list>
  </div>
</template>

<script>
const maxSize = 10000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    class: i % 2 === 0 ? 'q-pa-md self-center bg-grey-2 text-black' : 'q-pa-lg bg-black text-white'
  })
}

Object.freeze(heavyList)

export default {
  data () {
    return {
      heavyList
    }
  }
}
</script>
