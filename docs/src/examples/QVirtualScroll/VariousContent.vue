<template>
  <q-virtual-scroll
    style="max-height: 300px;"
    :items="heavyList"
    separator
  >
    <template v-slot="{ item, index }">
      <q-banner v-if="item.banner === true" class="bg-black text-white q-py-xl" :key="'a' + index">
        #{{ index }} - {{ item.label }}
      </q-banner>

      <q-item
        v-else
        :key="'b' + index"
        dense
        clickable
      >
        <q-item-section>
          <q-item-label>
            #{{ index }} - {{ item.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-virtual-scroll>
</template>

<script>
const maxSize = 10000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    banner: i % 5 === 0
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
